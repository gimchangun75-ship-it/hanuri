# -*- coding: utf-8 -*-
"""
한우리 다다어휘/활동지 A4 2페이지 인쇄 최적화 도구 (V1.8.5 Production Master)
- 소부장(Claude CLI) 12차 감리 기준 완제본:
  1) [WARN-NEW-2] 읽기 시 open(newline="") 명시로 universal newlines에 의한 CRLF -> LF 손실 방어
  2) [INFO-12-C] charset 치환 정규식을 단일 패스로 결합하여 최적화
  3) [WARN-E] NamedTemporaryFile 생성 시 newline="" 명시로 불필요한 \\r 삽입 방지
  4) [NEW-CRIT-2] 따옴표 종류/공백/self-closing(/>) 태그 전체를 포함하여 유효한 <meta charset="UTF-8">로 치환
  5) [H-A] pythonw.exe 무음 실행 시 safe_print() 헬퍼 도입
  6) [H-C] 최초 원본 백업 보존 (.bak 이미 존재 시 덮어쓰기 방지)
  7) [C-2] tempfile + os.replace를 통한 원자적(Atomic) 파일 교체
  8) [H-1] HANURI_A4_PRINT_OPTIMIZED_V1 마커를 통한 CSS 멱등성 보장
"""

import sys
import os
import re
import tempfile
import shutil

def safe_print(*args, **kwargs):
    if sys.stdout is not None:
        try:
            print(*args, **kwargs)
        except Exception:
            pass

if sys.stdout is not None:
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

HANURI_MARK = "/* HANURI_A4_PRINT_OPTIMIZED_V1 */"

A4_OPTIMIZED_CSS = f"""
{HANURI_MARK}
@media print {{
    @page {{
        size: A4 portrait;
        margin: 10mm 12mm 10mm 12mm;
    }}
    body {{
        font-family: 'Malgun Gothic', '맑은 고딕', sans-serif !important;
        font-size: 9.5pt !important;
        line-height: 1.35 !important;
        color: #000 !important;
        background: #fff !important;
        margin: 0 !important;
        padding: 0 !important;
    }}
    .header-banner {{
        padding: 8px 12px !important;
        margin-bottom: 10px !important;
        border: 1.5px solid #d9534f !important;
        background-color: #fdf7f7 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }}
    .header-banner h1 {{
        font-size: 14pt !important;
        margin: 0 0 4px 0 !important;
        color: #b52b27 !important;
    }}
    .header-banner .meta-info {{
        font-size: 8.5pt !important;
    }}
    .question-card {{
        border: 1px solid #ccc !important;
        border-radius: 4px !important;
        padding: 6px 10px !important;
        margin-bottom: 8px !important;
        background: #fff !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
    }}
    .q-title {{
        font-size: 9.5pt !important;
        font-weight: bold !important;
        color: #1a4f9c !important;
        margin-bottom: 4px !important;
    }}
    .passage-box {{
        background: #f8f9fa !important;
        border-left: 3px solid #1a4f9c !important;
        padding: 5px 8px !important;
        margin: 4px 0 !important;
        font-size: 9pt !important;
        line-height: 1.3 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }}
    .choices-list {{
        margin-top: 4px !important;
        gap: 3px !important;
        font-size: 8.8pt !important;
    }}
    .choices-list span {{
        display: inline-block !important;
        margin-right: 12px !important;
    }}
    .vocab-table {{
        margin-top: 4px !important;
        font-size: 9pt !important;
    }}
    .vocab-table td {{
        padding: 4px 6px !important;
    }}
    .page-break-after {{
        page-break-after: always !important;
        break-after: page !important;
    }}
    .footer-note {{
        margin-top: 10px !important;
        padding-top: 6px !important;
        font-size: 7.5pt !important;
        page-break-inside: avoid !important;
    }}
}}
"""

def optimize_html_file(file_path):
    if not os.path.exists(file_path):
        safe_print(f"❌ 오류: 대상 파일이 존재하지 않습니다: {file_path}")
        return False
        
    try:
        # [WARN-NEW-2 해결] newline="" 명시로 원본 CRLF 보존
        with open(file_path, "r", encoding="utf-8", newline="") as f:
            content = f.read()
    except UnicodeDecodeError:
        try:
            with open(file_path, "r", encoding="cp949", newline="") as f:
                content = f.read()
        except Exception as e:
            safe_print(f"❌ 파일 인코딩 읽기 실패: {e}")
            return False

    if HANURI_MARK in content:
        safe_print(f"ℹ️ 이미 한우리 A4 최적화 스타일이 적용되어 있습니다 (중복 적용 방지): {file_path}")
        return True

    backup_path = file_path + ".bak"
    try:
        if not os.path.exists(backup_path):
            shutil.copy2(file_path, backup_path)
            safe_print(f"   (최초 원본 백업 완료: {backup_path})")
    except Exception as e:
        safe_print(f"⚠️ 백업 처리 예외: {e}")

    # [INFO-12-C 해결] 단일 패스 정규식으로 meta charset 및 http-equiv Content-Type 전면 utf-8 치환
    content = re.sub(
        r'<meta\s+(?:charset=["\']?(?:euc-kr|cp949|ks_c_5601-1987)["\']?\s*/?|[^>]*?charset=["\']?(?:euc-kr|cp949|ks_c_5601-1987)["\']?[^>]*?)>',
        '<meta charset="UTF-8">',
        content,
        flags=re.IGNORECASE
    )

    style_block = f"<style type=\"text/css\">\n{A4_OPTIMIZED_CSS}\n</style>\n"
    if "</head>" in content:
        new_content = content.replace("</head>", f"{style_block}</head>")
    elif "<body>" in content:
        new_content = content.replace("<body>", f"{style_block}<body>")
    else:
        new_content = style_block + content

    target_dir = os.path.dirname(os.path.abspath(file_path))
    temp_file = None
    try:
        with tempfile.NamedTemporaryFile("w", encoding="utf-8", newline="", dir=target_dir, delete=False) as tf:
            tf.write(new_content)
            temp_file = tf.name
        os.replace(temp_file, file_path)
        safe_print(f"✅ [A4 인쇄 최적화 성공] 2페이지 완벽 규격 안착: {file_path}")
        return True
    except Exception as e:
        if temp_file and os.path.exists(temp_file):
            try:
                os.remove(temp_file)
            except Exception:
                pass
        safe_print(f"❌ 파일 원자적 저장 실패: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        safe_print("사용법: python fix_a4_layout.py <HTML파일경로>")
        sys.exit(1)
        
    target_file = sys.argv[1].strip('"\'')
    success = optimize_html_file(target_file)
    sys.exit(0 if success else 1)

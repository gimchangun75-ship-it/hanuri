# -*- coding: utf-8 -*-
"""
한우리 다다어휘/활동지 A4 인쇄 최적화 도구 (V2.0.0 Production Master)
- 소부장(Claude) 13차 감리 완제본 (2026-10-23)
  수리 목록:
  [FIX-CRIT-1] 가짜 클래스 5종 폐기 → 실측 클래스(.top-banner / .match-table / .word-cell 등) 전면 교체
  [FIX-CRIT-2] word-break: keep-all을 실제 클래스에 직접 주입 (한 글자 고아 방지)
  [FIX-CRIT-3] .page max-width + .match-table table-layout:fixed로 2페이지 넘침 원천 차단
  [FIX-A]     </head> 대소문자 불일치 버그 수정 (str.replace → re.sub IGNORECASE)
  [FIX-B]     BOM(UTF-8-SIG) 감지 및 저장 시 원본 BOM 상태 보존
  [FIX-C]     * { print-color-adjust: exact } 전역 선언 — 윈도우 Chrome/Edge 배경색 누락 차단
  기존 철칙 유지:
  [WARN-NEW-2] 읽기 시 newline="" 명시로 CRLF 손실 방어
  [INFO-12-C]  charset 치환 단일 패스 정규식
  [WARN-E]     NamedTemporaryFile newline="" 명시
  [NEW-CRIT-2] meta charset 전면 UTF-8 치환
  [H-A]        pythonw.exe 무음 실행 시 safe_print() 헬퍼
  [H-C]        최초 원본 백업 .bak 덮어쓰기 방지
  [C-2]        tempfile + os.replace 원자적(Atomic) 교체
  [H-1]        HANURI_MARK 마커 멱등성 보장
"""

import sys
import os
import re
import tempfile
import shutil

# =========================================================================
# [코드 수정 이력] (2026-10-23)
# 1. 수정 목적 (Why): 실제 다다어휘 HTML 클래스와 기존 CSS 타겟 완전 불일치로 서식 주입 0%
# 2. 결함 원인 (Problem): 추측으로 만든 가짜 클래스 5종 사용, keep-all 미주입,
#                         </head> 대소문자 버그, BOM 미보존, 배경색 미출력
# 3. 조치 내역 (What & How): 실측 클래스 전면 교체, keep-all 직접 주입,
#                            re.sub IGNORECASE 치환, BOM 감지·보존, 전역 print-color-adjust
# 4. 수호 원칙 (Rule): 원자적 저장, 멱등성, safe_print, BOM 보존, 백업 철칙 유지
# =========================================================================


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

A4_OPTIMIZED_CSS = f"""\
{HANURI_MARK}
@media print {{
    @page {{
        size: A4 portrait;
        margin: 10mm 12mm 10mm 12mm;
    }}

    /* [FIX-C] 윈도우 Chrome/Edge 배경색 누락 방지 — 전역 선언 */
    * {{
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        box-sizing: border-box !important;
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

    /* ── 페이지 컨테이너 ─────────────────────────────────────── */
    /* [FIX-CRIT-3] max-width로 2페이지 넘침 원천 차단 */
    .page {{
        width: 100% !important;
        max-width: 182mm !important;
        margin: 0 auto !important;
        padding: 0 !important;
    }}

    /* ── 탑 배너 ────────────────────────────────────────────── */
    /* [FIX-CRIT-1] .header-banner → .top-banner 교체 */
    .top-banner {{
        display: flex !important;
        flex-wrap: nowrap !important;
        align-items: center !important;
        padding: 5px 10px !important;
        margin-bottom: 8px !important;
        border: 1.5px solid #d9534f !important;
        background-color: #fdf7f7 !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
    }}
    .banner-left {{
        flex: 1 1 auto !important;
        padding: 2px 4px !important;
    }}
    .banner-right {{
        flex: 0 0 auto !important;
        padding: 2px 4px !important;
    }}
    .name-box {{
        font-size: 8.5pt !important;
        margin: 0 !important;
        white-space: nowrap !important;
    }}
    .unit {{
        font-size: 8.5pt !important;
        font-weight: bold !important;
        margin: 0 0 2px 0 !important;
    }}
    /* [FIX-CRIT-2] .title keep-all 주입 */
    .title {{
        font-size: 13pt !important;
        font-weight: bold !important;
        color: #b52b27 !important;
        margin: 0 0 2px 0 !important;
        word-break: keep-all !important;
        overflow-wrap: break-word !important;
    }}
    .badge,
    .badge-inst {{
        display: inline-block !important;
        font-size: 8pt !important;
        padding: 1px 5px !important;
        border-radius: 3px !important;
        white-space: nowrap !important;
    }}

    /* ── 어휘 매칭 표 ────────────────────────────────────────── */
    /* [FIX-CRIT-1] .vocab-table → .match-table 교체 */
    /* [FIX-CRIT-3] table-layout:fixed로 컬럼 폭 고정 */
    .match-table {{
        width: 100% !important;
        border-collapse: collapse !important;
        table-layout: fixed !important;
        font-size: 9.5pt !important;
        line-height: 1.35 !important;
        margin-bottom: 6px !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
    }}
    /* [FIX-CRIT-2] 핵심: word-break: keep-all 직접 주입 */
    .word-cell {{
        font-weight: bold !important;
        padding: 3px 6px !important;
        word-break: keep-all !important;
        overflow-wrap: break-word !important;
        white-space: normal !important;
    }}
    .mean-cell {{
        padding: 3px 6px !important;
        word-break: keep-all !important;
        overflow-wrap: break-word !important;
        white-space: normal !important;
    }}
    .dot-cell {{
        text-align: center !important;
        padding: 3px 2px !important;
        white-space: nowrap !important;
        width: 1em !important;
    }}
    .spacer-cell {{
        padding: 0 !important;
        width: 4px !important;
    }}
    .line-space {{
        line-height: 1.35 !important;
        margin: 0 !important;
        padding: 2px 0 !important;
    }}

    /* ── 범용 텍스트 요소 ─────────────────────────────────────── */
    /* [FIX-CRIT-2] td, th에도 keep-all 전파 */
    td, th {{
        word-break: keep-all !important;
        overflow-wrap: break-word !important;
        padding: 3px 5px !important;
    }}
    p, li {{
        word-break: keep-all !important;
        overflow-wrap: break-word !important;
        orphans: 3 !important;
        widows: 3 !important;
        margin: 2px 0 !important;
    }}

    /* ── 페이지 분리 제어 ─────────────────────────────────────── */
    .page-break-after {{
        page-break-after: always !important;
        break-after: page !important;
    }}
}}
"""


def _detect_bom(raw_bytes: bytes) -> bool:
    """UTF-8 BOM(EF BB BF) 감지."""
    return raw_bytes[:3] == b'\xef\xbb\xbf'


def optimize_html_file(file_path: str) -> bool:
    if not os.path.exists(file_path):
        safe_print(f"❌ 오류: 대상 파일이 존재하지 않습니다: {file_path}")
        return False

    # ── 읽기: BOM 감지 후 인코딩 분기 ──────────────────────────
    has_bom = False
    content = None
    used_encoding = 'utf-8'

    try:
        with open(file_path, "rb") as fb:
            raw = fb.read(4)
        has_bom = _detect_bom(raw)

        # [FIX-B] BOM 여부에 따라 인코딩 선택
        enc = 'utf-8-sig' if has_bom else 'utf-8'
        with open(file_path, "r", encoding=enc, newline="") as f:
            content = f.read()
        used_encoding = enc
    except UnicodeDecodeError:
        try:
            with open(file_path, "r", encoding="cp949", newline="") as f:
                content = f.read()
            used_encoding = 'cp949'
        except Exception as e:
            safe_print(f"❌ 파일 인코딩 읽기 실패: {e}")
            return False

    # ── 멱등성 보장 ──────────────────────────────────────────
    if HANURI_MARK in content:
        safe_print(f"ℹ️ 이미 한우리 A4 최적화 스타일이 적용되어 있습니다 (중복 적용 방지): {file_path}")
        return True

    # ── 원본 백업 (.bak 이미 존재 시 덮어쓰기 방지) ────────────
    backup_path = file_path + ".bak"
    try:
        if not os.path.exists(backup_path):
            shutil.copy2(file_path, backup_path)
            safe_print(f"   (최초 원본 백업 완료: {backup_path})")
    except Exception as e:
        safe_print(f"⚠️ 백업 처리 예외: {e}")

    # ── meta charset 단일 패스 치환 ──────────────────────────
    content = re.sub(
        r'<meta\s+(?:charset=["\']?(?:euc-kr|cp949|ks_c_5601-1987)["\']?\s*/?'
        r'|[^>]*?charset=["\']?(?:euc-kr|cp949|ks_c_5601-1987)["\']?[^>]*?)>',
        '<meta charset="UTF-8">',
        content,
        flags=re.IGNORECASE
    )

    # ── <style> 블록 주입 ────────────────────────────────────
    style_block = f'<style type="text/css">\n{A4_OPTIMIZED_CSS}\n</style>\n'

    # [FIX-A] </head> 대소문자 불일치 버그 수정
    head_match = re.search(r'</head>', content, flags=re.IGNORECASE)
    body_match = re.search(r'<body[\s>]', content, flags=re.IGNORECASE)

    if head_match:
        insert_pos = head_match.start()
        new_content = content[:insert_pos] + style_block + content[insert_pos:]
    elif body_match:
        insert_pos = body_match.start()
        new_content = content[:insert_pos] + style_block + content[insert_pos:]
    else:
        new_content = style_block + content

    # ── 원자적(Atomic) 저장 ───────────────────────────────────
    # [FIX-B] 원본 BOM 상태 보존: BOM 있었으면 utf-8-sig로 저장
    save_encoding = 'utf-8-sig' if has_bom else 'utf-8'

    target_dir = os.path.dirname(os.path.abspath(file_path))
    temp_file = None
    try:
        with tempfile.NamedTemporaryFile(
            "w", encoding=save_encoding, newline="",
            dir=target_dir, delete=False
        ) as tf:
            tf.write(new_content)
            temp_file = tf.name
        os.replace(temp_file, file_path)
        safe_print(f"✅ [A4 인쇄 최적화 성공] 실측 클래스 완전 반영 / keep-all 주입 완료: {file_path}")
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
        safe_print("사용법: python -X utf8 fix_a4_layout.py <HTML파일경로>")
        sys.exit(1)

    target_file = sys.argv[1].strip('"\'')
    success = optimize_html_file(target_file)
    sys.exit(0 if success else 1)

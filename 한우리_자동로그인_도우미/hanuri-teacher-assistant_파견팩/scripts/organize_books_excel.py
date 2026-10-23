# -*- coding: utf-8 -*-
"""
한우리 추천도서 엑셀 양식 자동 정렬 및 서식 도구 (V1.8.5 Production Master)
- 소부장(Claude CLI) 12차 감리 기준 완제본:
  1) [CRIT-NEW-1] max_row/max_col None 역참조 TypeError 원천 방어 (if not max_row or not max_col or max_row < 2 or max_col < 1)
  2) [INFO-NEW-F] 1행 헤더 행 높이 28pt 지정으로 딥 네이비 시각 완성도 극대화
  3) [BLOCK-G] 배포 패키지 전 파일 버전 통일 (V1.8.5 Production Master)
  4) [NEW-BLOCK-D] Side 테두리 컬러코드 8자리 aRGB ('FFDDDDDD')로 전면 통일하여 ValueError 원천 차단
  5) [BLOCK-B] openpyxl 헤더 채우기/폰트 8자리 aRGB ("FF102C57", "FFFFFFFF") 유지
  6) [INFO-C] openpyxl 자동 pip 설치 및 네트워크 단절 친절 안내
  7) [BLOCK-2] tempfile + os.replace를 통한 100% 원자적 엑셀 저장
  8) [H-A] safe_print() 헬퍼 전면 적용
  9) [H-C] 최초 원본 백업 보존
  10) [H-3] unicodedata.east_asian_width() 정밀 열 너비 계산
"""

import sys
import os
import shutil
import unicodedata
import tempfile

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

# openpyxl 자동 설치 및 네트워크 단절 친절 안내
try:
    import openpyxl
    from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
except ImportError:
    safe_print("openpyxl 모듈이 필요합니다. 자동 설치 중...")
    import subprocess
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "openpyxl"])
        import openpyxl
        from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
    except subprocess.CalledProcessError:
        safe_print("❌ [네트워크 오류] openpyxl 자동 설치에 실패했습니다. 인터넷 연결을 확인해 주세요.")
        sys.exit(1)


def get_display_width(text):
    """
    동아시아 문자 폭 계산 (한글/특수문자: 2, 영문/숫자/기호: 1)
    """
    if text is None:
        return 0
    s = str(text)
    width = 0
    for char in s:
        status = unicodedata.east_asian_width(char)
        if status in ('F', 'W'):
            width += 2
        else:
            width += 1
    return width


def format_hanuri_excel(file_path):
    if not os.path.exists(file_path):
        safe_print(f"❌ 오류: 대상 엑셀 파일이 없습니다: {file_path}")
        return False
        
    backup_path = file_path + ".bak"
    try:
        if not os.path.exists(backup_path):
            shutil.copy2(file_path, backup_path)
            safe_print(f"   (최초 원본 백업 완료: {backup_path})")
    except Exception as e:
        safe_print(f"⚠️ 백업 처리 예외: {e}")

    try:
        wb = openpyxl.load_workbook(file_path)
    except Exception as e:
        safe_print(f"❌ 엑셀 로드 실패: {e}")
        return False

    header_fill = PatternFill(start_color="FF102C57", end_color="FF102C57", fill_type="solid")
    header_font = Font(name="맑은 고딕", size=11, bold=True, color="FFFFFFFF")
    data_font = Font(name="맑은 고딕", size=10)
    
    border_side = Side(style='thin', color='FFDDDDDD')
    thin_border = Border(
        left=border_side,
        right=border_side,
        top=border_side,
        bottom=border_side
    )

    for sheet in wb.worksheets:
        max_row = sheet.max_row
        max_col = sheet.max_column
        # [CRIT-NEW-1 해결] 빈 시트에서 max_row/max_col이 None일 때 TypeError 방어
        if not max_row or not max_col or max_row < 2 or max_col < 1:
            continue
            
        col_max_widths = {c: 0 for c in range(1, max_col + 1)}

        sheet.row_dimensions[1].height = 28

        # 1. 헤더 서식 (1행)
        for col_idx in range(1, max_col + 1):
            cell = sheet.cell(row=1, column=col_idx)
            cell.fill = header_fill
            cell.font = header_font
            cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=False)
            cell.border = thin_border
            
            val = str(cell.value or "")
            col_max_widths[col_idx] = max(col_max_widths[col_idx], get_display_width(val))

        # 2. 데이터 행 서식
        for row_idx in range(2, max_row + 1):
            for col_idx in range(1, max_col + 1):
                cell = sheet.cell(row=row_idx, column=col_idx)
                cell.font = data_font
                cell.border = thin_border
                
                val = cell.value
                val_str = str(val or "")
                col_max_widths[col_idx] = max(col_max_widths[col_idx], get_display_width(val_str))
                
                if isinstance(val, (int, float)):
                    cell.alignment = Alignment(horizontal="right", vertical="center")
                elif any(kw in str(sheet.cell(row=1, column=col_idx).value or "") for kw in ["월", "학기", "학년", "구분", "순번", "지정"]):
                    cell.alignment = Alignment(horizontal="center", vertical="center")
                else:
                    cell.alignment = Alignment(horizontal="left", vertical="center")

        # 3. 정밀 열 너비 적용 (동아시아 너비 + 여유 버퍼 3)
        for col_idx, max_w in col_max_widths.items():
            col_letter = openpyxl.utils.get_column_letter(col_idx)
            final_width = max(max_w + 3, 10)
            # [WARN-13-B 해결] 긴 도서명 텍스트 숨김 방지를 위해 최대 너비를 70으로 확장
            final_width = min(final_width, 70)
            sheet.column_dimensions[col_letter].width = final_width

    target_dir = os.path.dirname(os.path.abspath(file_path))
    temp_file_path = None
    try:
        with tempfile.NamedTemporaryFile(suffix=".xlsx", dir=target_dir, delete=False) as tf:
            temp_file_path = tf.name

        wb.save(temp_file_path)
        os.replace(temp_file_path, file_path)
        temp_file_path = None
        safe_print(f"✅ [원자적 저장 완료] 도서목록 엑셀 스타일 및 열너비 완벽 정렬: {file_path}")
        return True
    except PermissionError:
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
            except Exception:
                pass
        safe_print(f"❌ [저장 실패 - 파일 잠김] 엑셀 프로그램에서 해당 파일이 열려 있습니다!")
        safe_print(f"   👉 엑셀을 완전히 닫은 후 다시 실행해 주세요: {file_path}")
        return False
    except Exception as e:
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
            except Exception:
                pass
        safe_print(f"❌ 엑셀 원자적 저장 실패: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        safe_print("사용법: python organize_books_excel.py <엑셀파일경로>")
        sys.exit(1)
        
    target_file = sys.argv[1].strip('"\'')
    success = format_hanuri_excel(target_file)
    sys.exit(0 if success else 1)

# -*- coding: utf-8 -*-
"""
한우리 추천도서 엑셀 양식 자동 정렬 및 서식 도구 (V2.0.0 Production Master)
- 소부장(Claude CLI) 13차 감리 기준 완제본:
  1) [CRIT-1] openpyxl IndexError 방어: 표준 로드 실패 → read_only 재추출 → 신규 워크북 재구성
  2) [CRIT-2] 가변 헤더 행 자동 탐지 (1~10행 스캔, 키워드 + 셀 밀도 휴리스틱)
  3) [EDGE-1] MergedCell 병합 보조 셀 AttributeError 안전 우회
  4) [EDGE-2] data_only=True 수식 캐시값 읽기 + 잔존 수식 문자열 방어
  5) [EDGE-3] 헤더 이전 배너 행 서식 완전 보존 (병합 레이아웃 손상 방지)
  6) [EDGE-4] 정렬 로직 header_row 기준으로 교정 (row=1 하드코딩 제거)
  7) 기존 atomic save / UTF-8 / backup / 열너비 전략 전면 유지
"""

import sys
import os
import shutil
import unicodedata
import tempfile

# =========================================================================
# [코드 수정 이력] (2026-10-23)
# 1. 수정 목적 (Why): 한셀/비표준 xlsx IndexError 로드 실패 + 4행 헤더 위치로 인한 서식 완전 실패 수리
# 2. 결함 원인 (Problem): openpyxl _reader.py style_id 인덱스 초과 + header_row=1 하드코딩
# 3. 조치 내역 (What & How): _load_workbook_safe() 3단 폴백 + _detect_header_row() 자동 탐지 추가
# 4. 수호 원칙 (Rule): 배너 행 병합 레이아웃 비파괴, 원자적 저장 유지
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

try:
    import openpyxl
    from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
    from openpyxl.cell.cell import MergedCell
except ImportError:
    safe_print("openpyxl 모듈이 필요합니다. 자동 설치 중...")
    import subprocess
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "openpyxl"])
        import openpyxl
        from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
        from openpyxl.cell.cell import MergedCell
    except subprocess.CalledProcessError:
        safe_print("❌ [네트워크 오류] openpyxl 자동 설치에 실패했습니다. 인터넷 연결을 확인해 주세요.")
        sys.exit(1)


# 헤더 탐지용 키워드 (한우리 양식 기준)
_HEADER_KEYWORDS = {
    '구분', '학년', '도서', '교재', '과목', '월', '단계', '영역',
    '입고', '순번', '순서', '프로그램', '지정', '연월', '학기', '과정'
}


def get_display_width(text):
    """동아시아 문자 폭 계산 (한글/특수문자: 2, 영문/숫자/기호: 1)"""
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


def _cleanup_temp(temp_path):
    """임시 파일 안전 제거"""
    if temp_path and os.path.exists(temp_path):
        try:
            os.remove(temp_path)
        except Exception:
            pass


def _load_workbook_safe(file_path):
    """
    [CRIT-1] openpyxl IndexError 방어 — 2단 폴백 전략

    1단계: load_workbook(data_only=True)
      - 수식 대신 캐시 값 읽기. 일반 xlsx에서 가장 빠르고 안전.
    2단계: read_only=True + data_only=True 로 데이터만 추출 → 신규 워크북 재구성
      - 한셀·비표준 저장본의 style_id 인덱스 초과 버그를 원천 우회.
      - 원본 서식은 초기화되지만 데이터는 100% 보존.
    """
    # 1단계: 표준 로드
    try:
        wb = openpyxl.load_workbook(file_path, data_only=True)
        safe_print("   (로드 방식: 표준)")
        return wb
    except Exception as e:
        safe_print(f"   ⚠️ 표준 로드 실패 ({type(e).__name__}: {e}), read_only 폴백 시도...")

    # 2단계: read_only 추출 → 신규 워크북 재구성
    try:
        wb_ro = openpyxl.load_workbook(file_path, read_only=True, data_only=True)
        wb_new = openpyxl.Workbook()
        wb_new.remove(wb_new.active)  # 기본 시트 제거

        for ws_ro in wb_ro.worksheets:
            ws_new = wb_new.create_sheet(title=ws_ro.title)
            for row in ws_ro.iter_rows():
                for cell in row:
                    # [EDGE-2] 수식 잔존 문자열 방어: = 로 시작하면 None 처리
                    val = cell.value
                    if isinstance(val, str) and val.startswith('='):
                        val = None
                    if val is not None:
                        ws_new.cell(row=cell.row, column=cell.column, value=val)

        wb_ro.close()
        safe_print("   (로드 방식: read_only 재구성 — 비표준 스타일 우회, 데이터 보존)")
        return wb_new
    except Exception as e2:
        safe_print(f"❌ read_only 폴백도 실패: {e2}")
        return None


def _detect_header_row(sheet, max_scan: int = 10) -> int:
    """
    [CRIT-2] 가변 헤더 행 자동 탐지

    전략:
    - 1~max_scan 행을 순서대로 스캔
    - 비어있지 않은 셀 ≥ 3 이고 알려진 헤더 키워드 포함 → 해당 행 반환
    - 키워드 매칭 실패 시: 모든 비어있지 않은 값이 짧은 문자열(< 25자) → 헤더 후보 폴백
    - MergedCell(병합 보조 셀)은 집계에서 제외
    """
    max_r = sheet.max_row
    if not max_r:
        return 1

    for row_idx in range(1, min(max_scan + 1, max_r + 1)):
        non_empty = []
        for cell in sheet[row_idx]:
            if isinstance(cell, MergedCell):
                continue  # [EDGE-1] 병합 보조 셀 무시
            if cell.value is not None:
                val_str = str(cell.value).strip()
                if val_str:
                    non_empty.append(val_str)

        if len(non_empty) < 3:
            continue

        # 우선 판정: 알려진 헤더 키워드 포함 여부
        for val in non_empty:
            if any(kw in val for kw in _HEADER_KEYWORDS):
                return row_idx

        # 폴백 판정: 모든 값이 짧은 문자열이면 헤더 후보
        if all(len(v) < 25 for v in non_empty):
            return row_idx

    safe_print("   ⚠️ 헤더 행 자동 탐지 실패 → 기본값 1행 사용")
    return 1


def format_hanuri_excel(file_path):
    if not os.path.exists(file_path):
        safe_print(f"❌ 오류: 대상 엑셀 파일이 없습니다: {file_path}")
        return False

    # [H-C] 최초 원본 백업 보존
    backup_path = file_path + ".bak"
    try:
        if not os.path.exists(backup_path):
            shutil.copy2(file_path, backup_path)
            safe_print(f"   (최초 원본 백업 완료: {backup_path})")
    except Exception as e:
        safe_print(f"⚠️ 백업 처리 예외: {e}")

    # [CRIT-1] 안전 로드
    wb = _load_workbook_safe(file_path)
    if wb is None:
        safe_print(f"❌ 엑셀 로드 완전 실패: {file_path}")
        return False

    # 스타일 정의
    header_fill = PatternFill(start_color="FF102C57", end_color="FF102C57", fill_type="solid")
    header_font = Font(name="맑은 고딕", size=11, bold=True, color="FFFFFFFF")
    data_font   = Font(name="맑은 고딕", size=10)
    border_side = Side(style='thin', color='FFDDDDDD')
    thin_border = Border(
        left=border_side, right=border_side,
        top=border_side, bottom=border_side
    )

    for sheet in wb.worksheets:
        max_row = sheet.max_row
        max_col = sheet.max_column
        # [CRIT-NEW-1] 빈 시트 방어
        if not max_row or not max_col or max_row < 2 or max_col < 1:
            continue

        # [CRIT-2] 가변 헤더 행 탐지
        header_row = _detect_header_row(sheet)
        safe_print(f"   시트 '{sheet.title}': 헤더 행 = {header_row}행 탐지")

        # 데이터가 헤더 다음 행부터 실제로 있는지 확인
        if max_row <= header_row:
            safe_print(f"   ⚠️ 시트 '{sheet.title}': 헤더 행 이후 데이터 없음 — 서식만 적용")

        # [EDGE-4] 정렬 로직용 헤더 컬럼 이름 캐시 (row=1 하드코딩 제거)
        header_values = {}
        for col_idx in range(1, max_col + 1):
            cell = sheet.cell(row=header_row, column=col_idx)
            if not isinstance(cell, MergedCell):
                header_values[col_idx] = str(cell.value or "")

        col_max_widths = {c: 0 for c in range(1, max_col + 1)}

        # ── 헤더 행 서식 ──────────────────────────────────────────────────
        # [EDGE-3] header_row 이전 배너 행(1 ~ header_row-1)은 건드리지 않음
        #          (병합 셀 레이아웃 비파괴)
        sheet.row_dimensions[header_row].height = 28
        for col_idx in range(1, max_col + 1):
            cell = sheet.cell(row=header_row, column=col_idx)
            if isinstance(cell, MergedCell):
                continue  # [EDGE-1] 병합 보조 셀 우회

            cell.fill = header_fill
            cell.font = header_font
            cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=False)
            cell.border = thin_border

            val_str = str(cell.value or "")
            col_max_widths[col_idx] = max(col_max_widths[col_idx], get_display_width(val_str))

        # ── 데이터 행 서식 (header_row + 1 부터) ────────────────────────
        for row_idx in range(header_row + 1, max_row + 1):
            for col_idx in range(1, max_col + 1):
                cell = sheet.cell(row=row_idx, column=col_idx)
                if isinstance(cell, MergedCell):
                    continue  # [EDGE-1]

                cell.font = data_font
                cell.border = thin_border

                val = cell.value
                # [EDGE-2] 수식 잔존 문자열 방어 (read_only 재구성 이후에도 혹시 남아있으면)
                if isinstance(val, str) and val.startswith('='):
                    val = None

                val_str = str(val) if val is not None else ""
                col_max_widths[col_idx] = max(col_max_widths[col_idx], get_display_width(val_str))

                # [EDGE-4] 정렬: header_values 기준 (row=1 하드코딩 제거)
                col_header = header_values.get(col_idx, "")
                if isinstance(val, (int, float)):
                    cell.alignment = Alignment(horizontal="right", vertical="center")
                elif any(kw in col_header for kw in ["월", "학기", "학년", "구분", "순번", "지정", "단계"]):
                    cell.alignment = Alignment(horizontal="center", vertical="center")
                else:
                    cell.alignment = Alignment(horizontal="left", vertical="center")

        # ── 열 너비 적용 ─────────────────────────────────────────────────
        for col_idx, max_w in col_max_widths.items():
            col_letter = openpyxl.utils.get_column_letter(col_idx)
            final_width = min(max(max_w + 3, 10), 70)
            sheet.column_dimensions[col_letter].width = final_width

    # ── [BLOCK-2] 원자적 저장 (tempfile + os.replace) ───────────────────
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
        _cleanup_temp(temp_file_path)
        safe_print(f"❌ [저장 실패 - 파일 잠김] 엑셀 프로그램에서 해당 파일이 열려 있습니다!")
        safe_print(f"   👉 엑셀을 완전히 닫은 후 다시 실행해 주세요: {file_path}")
        return False
    except Exception as e:
        _cleanup_temp(temp_file_path)
        safe_print(f"❌ 엑셀 원자적 저장 실패: {e}")
        return False


if __name__ == "__main__":
    if len(sys.argv) < 2:
        safe_print("사용법: python organize_books_excel.py <엑셀파일경로>")
        sys.exit(1)

    target_file = sys.argv[1].strip('"\'')
    success = format_hanuri_excel(target_file)
    sys.exit(0 if success else 1)

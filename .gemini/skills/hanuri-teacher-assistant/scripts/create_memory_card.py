# -*- coding: utf-8 -*-
"""
[hanuri-teacher-assistant] create_memory_card.py (V1.8.5 Production Master)
- 소부장(Claude CLI) 12차 감리 반영 완제본:
  1) [WARN-NEW-3] tempfile + os.replace를 통한 원자적(Atomic) 파일 저장 패턴 전면 통일
  2) [WARN-NEW-3] D:\\한우리 폴더 부재 시 자동 생성(os.makedirs) 지원 및 실패 시 명확한 에러 반환
  3) [INFO-12-A] AI(키티) 마크다운 파서 오동작 방지를 위해 BOM 없는 표준 UTF-8로 저장
  4) [BLOCK-H] sys.exit(0 if success else 1) 명시로 배치 파일 ERRORLEVEL 연동 완성
  5) [BLOCK-G] 배포 패키지 전 파일 버전 통일 (V1.8.5 Production Master)
"""

import sys
import os
import datetime
import tempfile

def safe_print(*args, **kwargs):
    if sys.stdout is not None:
        try:
            print(*args, **kwargs)
        except Exception:
            pass

def init_memory_card():
    target_folder = r"D:\한우리"
    target_file = os.path.join(target_folder, "00_선생님_작업기억카드.md")

    # D:\ 드라이브가 없는 경우 사용자 홈 디렉터리의 '한우리' 폴더로 안전 폴백
    drive = os.path.splitdrive(target_folder)[0]
    drive_root = drive + "\\" if drive and not drive.endswith("\\") else drive
    # [INFO-13-B 해결] 드라이브 루트 확인 시 isdir(drive_root)로 정확성 확보
    if drive_root and not os.path.isdir(drive_root):
        target_folder = os.path.join(os.path.expanduser("~"), "한우리")
        target_file = os.path.join(target_folder, "00_선생님_작업기억카드.md")

    try:
        os.makedirs(target_folder, exist_ok=True)
    except Exception as e:
        safe_print(f"     -> [오류] 대상 폴더 생성 실패 ({target_folder}): {e}")
        return False

    if os.path.exists(target_file):
        safe_print(f"     -> {target_file} 기존 파일 유지")
        return True

    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    content = f"""# 📌 [키티의 미종 선생님 최신 작업 기억 카드]
- 최종 갱신 시각: {now_str}
- 현재 작업 중인 진짜 최종본 파일:
  * 세계분쟁 PPT: D:\\한우리\\지리 교과서 속 세계분쟁(최종수업_완전무결판).pptx
  * 다다어휘 조판: D:\\한우리\\다다어휘(부교재)\\1호\\디자인완성본\\
  * 월간 도서목록: D:\\한우리\\1.월간도서교재(2026년_1월~10월_정리본).xlsx
- 선생님 특별 지침:
  * 캡션 지울 때 지도 절대 손대지 말 것 (핀포인트 삭제)
  * 다다어휘 한 글자 넘침 방지 및 1페이지 완결 조판 엄수
- 다음 예정 작업:
  * 별별문학 필독서 2차시 문제지 검토
"""
    temp_file = None
    try:
        # [WARN-NEW-3 & INFO-12-A] 원자적 저장 및 표준 UTF-8 보장
        with tempfile.NamedTemporaryFile("w", encoding="utf-8", newline="", dir=target_folder, delete=False) as tf:
            tf.write(content)
            temp_file = tf.name
        os.replace(temp_file, target_file)
        temp_file = None
        safe_print(f"     -> {target_file} 원자적 생성 완료! (표준 UTF-8 무결점)")
        return True
    except Exception as e:
        if temp_file and os.path.exists(temp_file):
            try:
                os.remove(temp_file)
            except Exception:
                pass
        safe_print(f"     -> [경고] 기억카드 원자적 생성 예외: {e}")
        return False

if __name__ == "__main__":
    success = init_memory_card()
    sys.exit(0 if success else 1)

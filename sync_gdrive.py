# -*- coding: utf-8 -*-
"""
👑 주식회사 완좋아 한우리 1시간 무음 동기화 엔진 (Python + Robocopy)
"""
import os
import subprocess
from datetime import datetime

SRC = r"G:\내 드라이브\한우리"
DST = r"D:\한우리"
LOG_PATH = r"D:\한우리\sync_last.log"

def log(msg: str):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    formatted = f"[{timestamp}] {msg}\n"
    try:
        with open(LOG_PATH, "a", encoding="utf-8") as f:
            f.write(formatted)
    except Exception:
        pass

def sync():
    # 1. 이전 로그 초기화 및 시작 기록
    try:
        with open(LOG_PATH, "w", encoding="utf-8") as f:
            f.write(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] === 한우리 구글 드라이브 1시간 동기화 시작 ===\n")
    except Exception:
        pass

    # 2. 구글 드라이브 마운트 확인
    if not os.path.exists(SRC):
        log(f"[ERROR] 구글 드라이브 원본 경로를 찾을 수 없습니다: {SRC}")
        return False

    os.makedirs(DST, exist_ok=True)

    # 3. Robocopy 명령어 조립
    cmd = [
        "robocopy",
        SRC,
        DST,
        "/E",
        "/MT:16",
        "/FFT",
        "/R:1",
        "/W:1",
        "/NP",
        "/XO",
        "/NDL",
        "/XD",
        "$RECYCLE.BIN",
        "System Volume Information",
        ".tmp.drivedownload",
        ".git",
        "/XF",
        "*.gdoc",
        "*.gsheet",
        "*.gslides"
    ]

    try:
        # 콘솔 창 생성 없이 무음 실행 (CREATE_NO_WINDOW)
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            encoding="cp949",
            errors="replace",
            creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0
        )
        
        # Robocopy exit codes: 0~7 are success (0=no change, 1=copied, etc.)
        exit_code = result.returncode
        if exit_code <= 7:
            log(f"[SUCCESS] 동기화 정상 완료 (코드: {exit_code})")
        else:
            log(f"[WARNING] 복사 중 일부 주의사항 발생 (코드: {exit_code})")
            
        # 요약 로그 추가
        if result.stdout:
            lines = [line.strip() for line in result.stdout.splitlines() if line.strip()]
            summary_lines = lines[-10:] if len(lines) >= 10 else lines
            log("--- [Robocopy 요약] ---")
            for sl in summary_lines:
                log(f"  {sl}")

        return True
    except Exception as e:
        log(f"[EXCEPTION] 동기화 중 에러 발생: {e}")
        return False

if __name__ == "__main__":
    sync()

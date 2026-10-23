import subprocess, os, sys
from datetime import datetime

BASE_DIR = r'D:\한우리\대화방_기억보관소'
LOG_FILE = os.path.join(BASE_DIR, 'sync_log.txt')

def log(msg):
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    line = f"[{timestamp}] {msg}\n"
    print(line, end='')
    try:
        with open(LOG_FILE, 'a', encoding='utf-8') as f:
            f.write(line)
    except Exception as e:
        print(f"Log error: {e}")

def run_sync():
    log("=== [키티 엔진] 10분 주기 대화방 온톨로지 동기화 시작 ===")
    
    # 1. sync_daily_memory.js 실행
    try:
        p1 = subprocess.run(['node', r'D:\기억보관소\sync_daily_memory.js'], capture_output=True, text=True, encoding='utf-8', errors='ignore')
        if p1.returncode == 0:
            log("1단계: 대화 추출 및 온톨로지 지식 그래프 갱신 완료")
        else:
            log(f"1단계 경고: {p1.stderr.strip() or p1.stdout.strip()}")
    except Exception as e:
        log(f"1단계 실패: {e}")

    # 2. build_memory_archive.py 실행
    try:
        builder_path = os.path.join(BASE_DIR, 'build_memory_archive.py')
        p2 = subprocess.run([sys.executable, builder_path], capture_output=True, text=True, encoding='utf-8', errors='ignore')
        if p2.returncode == 0:
            log(f"2단계: {p2.stdout.strip()}")
        else:
            log(f"2단계 경고: {p2.stderr.strip() or p2.stdout.strip()}")
    except Exception as e:
        log(f"2단계 실패: {e}")

    log("=== 10분 주기 대화방 동기화 성공 완료 ===\n")

if __name__ == '__main__':
    run_sync()

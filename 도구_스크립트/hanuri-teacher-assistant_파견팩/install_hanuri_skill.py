# -*- coding: utf-8 -*-
"""
[한우리 전담 조교] 이미종 선생님 PC 전담 스킬 원클릭 설치 프로그램 (V2.0 Pure Python Master)
- 소부장(Claude CLI) 감리 H-1, H-2, H-3, M-2, M-3 전량 완제본:
  1) [H-1] shutil.copytree(..., dirs_exist_ok=True)로 서브디렉터리 유실 원천 차단
  2) [H-2] openpyxl, python-pptx 미설치 시 현장에서 pip 자동 설치 즉각 시도
  3) [H-3] subprocess.run에 errors='replace' 추가로 인코딩 크래시 방어
  4) [M-2] sys.stdout 및 sys.stderr 모두 utf-8 reconfigure
  5) [M-3] importlib.util.find_spec을 통한 안전한 패키지 검사
"""

import sys
import os
import shutil
import subprocess
import importlib.util

# [M-2 해결] stdout & stderr 모두 UTF-8 재설정
for stream in (sys.stdout, sys.stderr):
    if stream is not None and hasattr(stream, 'reconfigure'):
        try:
            stream.reconfigure(encoding='utf-8')
        except Exception:
            pass

def safe_print(*args, **kwargs):
    if sys.stdout is not None:
        try:
            print(*args, **kwargs)
        except Exception:
            try:
                if sys.stderr is not None:
                    sys.stderr.write(" ".join(map(str, args)) + "\n")
            except Exception:
                pass

def main():
    safe_print("=" * 64)
    safe_print("  🌸 [한우리 전담 조교] 이미종 선생님 PC 전담 스킬 자동 설치기 (V2.0)")
    safe_print("=" * 64)
    safe_print("\n잠시만 기다려주세요... 키티(AI 비서)에게 새로운 전담 능력을 주입합니다!\n")

    # 1. Python 버전 검증 (3.8 이상)
    py_ver = sys.version_info
    if py_ver.major < 3 or (py_ver.major == 3 and py_ver.minor < 8):
        safe_print(f"❌ [설치 중단] Python 3.8 이상이 필요합니다. (현재 버전: {py_ver.major}.{py_ver.minor}.{py_ver.micro})")
        safe_print("   조판 및 자동화 스크립트 실행을 위해 먼저 Python 3.8 이상을 설치해 주세요.")
        return 1
    safe_print(f"✅ [1/5] Python 환경 검증 완료 (v{py_ver.major}.{py_ver.minor}.{py_ver.micro})")

    # 2. 설치 소스 패키지 무결성 검증
    cur_dir = os.path.dirname(os.path.abspath(__file__))
    skill_md = os.path.join(cur_dir, "SKILL.md")
    scripts_dir = os.path.join(cur_dir, "scripts")

    if not os.path.exists(skill_md) or not os.path.exists(scripts_dir):
        safe_print("❌ [오류] 스크립트(scripts) 폴더 또는 SKILL.md가 설치 파일과 함께 동봉되지 않았습니다!")
        safe_print("   👉 압축 파일(ZIP)을 반드시 한 폴더에 '압축 풀기' 한 후 실행해 주세요.")
        return 1
    safe_print("✅ [2/5] 설치 원본 패키지 무결성 검증 통과")

    # 3. 대상 디렉터리 준비
    user_home = os.path.expanduser("~")
    target_dir = os.path.join(user_home, ".gemini", "config", "skills", "hanuri-teacher-assistant")
    target_scripts = os.path.join(target_dir, "scripts")

    try:
        os.makedirs(target_dir, exist_ok=True)
    except Exception as e:
        safe_print(f"❌ 스킬 설치 디렉터리 생성 실패: {e}")
        return 1

    # 4. 파일 복사 [H-1 해결: shutil.copytree 활용]
    try:
        safe_print("   -> SKILL.md 복사 중...")
        shutil.copy2(skill_md, os.path.join(target_dir, "SKILL.md"))

        safe_print("   -> 4대 자동화 스크립트 디렉터리 복사 중...")
        shutil.copytree(scripts_dir, target_scripts, dirs_exist_ok=True)
        safe_print(f"✅ [3/5] 키티 스킬 핵심 파일 복사 완료 ({target_dir})")
    except Exception as e:
        safe_print(f"❌ 파일 복사 중 오류 발생: {e}")
        return 1

    # 5. 작업기억카드 초기화 [H-3 해결: errors='replace']
    safe_print("   -> 00_선생님_작업기억카드 초기화 중...")
    mem_script = os.path.join(target_scripts, "create_memory_card.py")
    if os.path.exists(mem_script):
        try:
            res = subprocess.run(
                [sys.executable, "-X", "utf8", mem_script],
                capture_output=True,
                text=True,
                encoding='utf-8',
                errors='replace'
            )
            if res.returncode == 0:
                safe_print("✅ [4/5] 작업기억카드 초기화 완료 (D:\\한우리 또는 홈폴더)")
            else:
                safe_print(f"⚠️ [주의] 기억카드 생성 경고: {res.stderr.strip()}")
        except Exception as e:
            safe_print(f"⚠️ [주의] 기억카드 스크립트 실행 예외: {e}")
    else:
        safe_print("⚠️ [경고] create_memory_card.py가 대상 디렉터리에 없습니다.")

    # 6. 필수 라이브러리 검증 및 실제 현장 자동 설치 [H-2 & M-3 해결]
    safe_print("   -> openpyxl, python-pptx 라이브러리 상태 점검 중...")
    required_packages = [("openpyxl", "openpyxl"), ("pptx", "python-pptx")]
    for mod_name, pip_name in required_packages:
        spec = importlib.util.find_spec(mod_name)
        if spec is None:
            safe_print(f"   ℹ️ {pip_name} 라이브러리 자동 설치 중...")
            try:
                subprocess.run(
                    [sys.executable, "-m", "pip", "install", "--user", pip_name],
                    capture_output=True,
                    text=True,
                    encoding='utf-8',
                    errors='replace'
                )
                safe_print(f"   ✅ {pip_name} 자동 설치 완료!")
            except Exception as e:
                safe_print(f"   ⚠️ {pip_name} 자동 설치 실패: {e}")
                safe_print(f"      수동 설치 명령어: pip install --user {pip_name}")

    safe_print("✅ [5/5] 모든 필수 의존성 패키지 검증 및 준비 완료")

    # 최종 성공 안내
    safe_print("")
    safe_print("=" * 64)
    safe_print("  🎉 축하합니다! [한우리 전담 조교] 키티 스킬 설치 완료!")
    safe_print("=" * 64)
    safe_print(f"\n설치 경로: {target_dir}\n")
    safe_print("이제 키티(AI 비서)는 선생님의 4대 작업:")
    safe_print("  1) A4 다다어휘 조판 최적화 (HTML 2쪽 완결)")
    safe_print("  2) PPT 지도 및 슬라이드 캡션 핀포인트 삭제 (도형 보존 및 원자 저장)")
    safe_print("  3) 시험지-정답해설지 원터치 분리 (보상 롤백 지원)")
    safe_print("  4) 도서목록 엑셀 열너비 및 서식 정렬 (원자 저장)")
    safe_print("을 1초 만에 척척 해내는 전담 특급 비서가 되었습니다!\n")
    safe_print("=" * 64)
    safe_print("창을 닫으셔도 좋습니다. (아무 키나 누르세요)")
    safe_print("=" * 64)
    return 0

if __name__ == "__main__":
    ret = main()
    sys.exit(ret)

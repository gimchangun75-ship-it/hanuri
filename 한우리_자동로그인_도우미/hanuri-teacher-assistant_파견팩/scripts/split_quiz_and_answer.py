# -*- coding: utf-8 -*-
"""
한우리 퀴즈/모의평가 문제지 및 정답해설지 자동 분리 도구 (V1.8.5 Production Master)
- 소부장(Claude CLI) 11차 감리 기준 완제본:
  1) [WARN-NEW-C] strip() 선두 공백 줄 제거 부작용 방지: rstrip() 위주로 안전 저장
  2) [CRIT-8] newline="" + 명시적 CRLF(\\r\\n) 출력으로 \\r\\r\\n 이중 변환 원천 차단
  3) [BLOCK-G] 배포 패키지 전 파일 버전 통일 (V1.8.5 Production Master)
  4) [WARN-B] split_index <= 0 엣지 케이스 가드
  5) [INFO-D] 인코딩 묵시적 변환 투명화
  6) [WARN-2] 보상 트랜잭션(Rollback) 완비
  7) [H-A] safe_print() 헬퍼 전면 적용
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

SPLIT_PATTERNS = [
    r"\[\s*정답\s*(?:및|과)?\s*해설.*\]",
    r"정답\s*및\s*해설지\s*\(교사용\)",
    r"^=+\s*\[?\s*(?:정답|정답\s*및\s*해설|해설|정답표|교사용)\s*\]?\s*=*",
    r"^■\s*(?:정답|정답\s*및\s*해설|1교시\s*객관식\s*정답표)",
    r"^<정답\s*및\s*해설>",
    r"^===\s*정답\s*==="
]

def split_quiz_file(file_path):
    if not os.path.exists(file_path):
        safe_print(f"❌ 오류: 대상 시험지 텍스트 파일이 없습니다: {file_path}")
        return False
        
    content = ""
    used_enc = "utf-8"
    for enc in ["utf-8", "cp949", "euc-kr"]:
        try:
            # [INFO-13-A 해결] newline="" 명시로 원본 줄바꿈 보존 일관성 확보
            with open(file_path, "r", encoding=enc, newline="") as f:
                content = f.read()
            used_enc = enc
            break
        except UnicodeDecodeError:
            continue
            
    if content is None:
        safe_print(f"❌ 파일 인코딩 읽기 실패: {file_path}")
        return False
    elif not content.strip():
        safe_print(f"❌ 파일 내용이 비어 있습니다 (0바이트): {file_path}")
        return False

    lines = content.splitlines()
    split_index = -1
    
    for i, line in enumerate(lines):
        line_clean = line.strip()
        for pat in SPLIT_PATTERNS:
            if re.search(pat, line_clean, re.IGNORECASE):
                target_idx = i
                while target_idx > 0 and re.match(r"^=+$", lines[target_idx - 1].strip()):
                    target_idx -= 1
                split_index = target_idx
                break
        if split_index != -1:
            break

    base_name, ext = os.path.splitext(file_path)
    
    if split_index == -1:
        safe_print(f"⚠️ 정답 및 해설 분리 구분자를 찾지 못했습니다. 파일 전체를 문제지로 유지합니다: {file_path}")
        return False

    if split_index <= 0:
        safe_print(f"⚠️ [분리 중단] 정답/해설 구분자가 문서의 첫머리(줄 {split_index})에 위치하여 문제지가 비어 있습니다: {file_path}")
        return False
        
    quiz_lines = lines[:split_index]
    answer_lines = lines[split_index:]
    
    quiz_path = f"{base_name}_학생용문제지{ext}"
    answer_path = f"{base_name}_교사용정답해설지{ext}"
    target_dir = os.path.dirname(os.path.abspath(file_path))

    tf_quiz_name = None
    tf_ans_name = None
    quiz_backup_temp = None

    try:
        with tempfile.NamedTemporaryFile("w", encoding="utf-8", newline="", dir=target_dir, delete=False) as tf_q:
            tf_q.write("\r\n".join(quiz_lines).rstrip() + "\r\n")
            tf_quiz_name = tf_q.name
            
        with tempfile.NamedTemporaryFile("w", encoding="utf-8", newline="", dir=target_dir, delete=False) as tf_a:
            tf_a.write("\r\n".join(answer_lines).rstrip() + "\r\n")
            tf_ans_name = tf_a.name

        if os.path.exists(quiz_path):
            with tempfile.NamedTemporaryFile(dir=target_dir, delete=False) as tf_b:
                quiz_backup_temp = tf_b.name
            shutil.copy2(quiz_path, quiz_backup_temp)

        os.replace(tf_quiz_name, quiz_path)
        tf_quiz_name = None

        try:
            os.replace(tf_ans_name, answer_path)
            tf_ans_name = None
        except Exception as e_ans:
            if quiz_backup_temp and os.path.exists(quiz_backup_temp):
                os.replace(quiz_backup_temp, quiz_path)
                quiz_backup_temp = None
            elif os.path.exists(quiz_path):
                os.remove(quiz_path)
            raise RuntimeError(f"교사용 정답지 교체 실패로 인한 전체 롤백: {e_ans}")

        if quiz_backup_temp and os.path.exists(quiz_backup_temp):
            try:
                os.remove(quiz_backup_temp)
            except Exception:
                pass

        safe_print(f"✅ [시험지 무결점 원자적 분리 완료]")
        safe_print(f"   👉 학생 배포용 문제지 : {quiz_path} ({len(quiz_lines)} 줄)")
        safe_print(f"   👉 교사용 정답 및 해설지: {answer_path} ({len(answer_lines)} 줄)")
        if used_enc != "utf-8":
            safe_print(f"   (원본 인코딩: {used_enc} -> 표준 UTF-8 변환 저장 완료)")
        return True
    except Exception as e:
        for tf in [tf_quiz_name, tf_ans_name, quiz_backup_temp]:
            if tf and os.path.exists(tf):
                try:
                    os.remove(tf)
                except Exception:
                    pass
        safe_print(f"❌ 파일 분리 원자적 저장 실패 (롤백 완료): {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        safe_print("사용법: python split_quiz_and_answer.py <시험지텍스트파일경로>")
        sys.exit(1)
        
    target_file = sys.argv[1].strip('"\'')
    success = split_quiz_file(target_file)
    sys.exit(0 if success else 1)

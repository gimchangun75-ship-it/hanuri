# -*- coding: utf-8 -*-
"""
한우리 퀴즈/모의평가 문제지 및 정답해설지 자동 분리 도구
V2.0.0 HWPX Dual Engine — 소부장(Claude) 12차 감리 완제본
  .txt / .hwpx 자동 판별 듀얼 엔진
  HWPX: OCF 표준 재압축 · ET 네임스페이스 보존 · 원자적 temp→replace
  TXT : V1.8.5 Production Master 로직 100% 호환
"""

# =========================================================================
# [코드 수정 이력] (2026-10-23)
# 1. 수정 목적 (Why): .hwpx (ZIP/XML) 포맷 학생용/교사용 자동 분리 지원 추가
# 2. 결함 원인 (Problem): 기존 V1.8.5는 .txt 전용; 실제 시험지가 .hwpx 포맷
# 3. 조치 내역 (What & How):
#    - HWPX 엔진 신설 (split_quiz_file_hwpx)
#    - OCF 표준 재압축 (_repack_hwpx): mimetype ZIP_STORED 선두 배치 명시
#    - iterparse start-ns + register_namespace 로 hp:/hc: 원본 접두사 보존
#    - {*} 와일드카드 파싱으로 hp 버전 무관 동작
#    - parent_map 역방향 맵 (O(n) 단일 순회) 으로 문단 제거 안전화
#    - 기준 섹션 이후 section*.xml 전체 학생용 비움 처리
#    - SPLIT_PATTERNS 4개 추가 (정답:, 정답표, 모범 답안, 【정답)
#    - split_quiz_file() 통합 라우터: .hwpx/.txt 자동 판별
#    - XML 선언 큰따옴표 표준 규격(<?xml version="1.0" encoding="UTF-8"?>) 보장
# 4. 수호 원칙 (Rule): TXT 엔진 변경 없음, 원자적 temp→replace 유지
# =========================================================================

import sys
import os
import re
import io
import zipfile
import tempfile
import shutil
import xml.etree.ElementTree as ET

# ── 표준 출력 UTF-8 강제 ──────────────────────────────────────────────────
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

# ── 정답/해설 분리 패턴 (TXT·HWPX 공용) ─────────────────────────────────
SPLIT_PATTERNS = [
    r"\[\s*정답\s*(?:및|과)?\s*해설.*\]",
    r"정답\s*및\s*해설지\s*\(교사용\)",
    r"^=+\s*\[?\s*(?:정답|정답\s*및\s*해설|해설|정답표|교사용)\s*\]?\s*=*",
    r"^■\s*(?:정답|정답\s*및\s*해설|1교시\s*객관식\s*정답표)",
    r"^<정답\s*및\s*해설>",
    r"^===\s*정답\s*===",
    r"^정답\s*[:\uff1a]",       # '정답:' / '정답：' (전각 콜론 포함)
    r"^정답표\s*$",             # 단독 '정답표' 줄
    r"\[\s*모범\s*답안\s*\]",   # '[모범 답안]'
    r"^【\s*정답",              # '【정답...'
    r"\[\s*답안\s*\]",          # '[ 답안 ]' (한우리 수필 등 현장 꼭지별 답안 표기)
    r"\[.*답안.*\]",            # '[ 8차 ][ 답안 ]' 등 복합 답안 표기
]

def _matches_split(text: str) -> bool:
    """한 줄 텍스트가 분리 기준 패턴에 해당하는지 검사."""
    text = text.strip()
    for pat in SPLIT_PATTERNS:
        if re.search(pat, text, re.IGNORECASE):
            return True
    return False


# ════════════════════════════════════════════════════════════════════════════
# TXT 엔진 (V1.8.5 Production Master — 로직 무변경)
# ════════════════════════════════════════════════════════════════════════════
def split_quiz_file_txt(file_path: str) -> bool:
    content = ""
    used_enc = "utf-8"
    for enc in ["utf-8", "cp949", "euc-kr"]:
        try:
            with open(file_path, "r", encoding=enc, newline="") as f:
                content = f.read()
            used_enc = enc
            break
        except UnicodeDecodeError:
            continue

    if not content or not content.strip():
        safe_print(f"❌ 파일 내용이 비어 있거나 인코딩 읽기 실패: {file_path}")
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
        safe_print(f"⚠️ 정답/해설 구분자 미발견 — 파일 전체 문제지로 유지: {file_path}")
        return False
    if split_index <= 0:
        safe_print(f"⚠️ [분리 중단] 구분자가 첫머리(줄 {split_index}) → 문제지가 비어 있음: {file_path}")
        return False

    quiz_lines   = lines[:split_index]
    answer_lines = lines[split_index:]
    quiz_path    = f"{base_name}_학생용문제지{ext}"
    answer_path  = f"{base_name}_교사용정답해설지{ext}"
    target_dir   = os.path.dirname(os.path.abspath(file_path))

    tf_quiz_name = tf_ans_name = quiz_backup_temp = None
    try:
        with tempfile.NamedTemporaryFile("w", encoding="utf-8", newline="",
                                         dir=target_dir, delete=False) as tf_q:
            tf_q.write("\r\n".join(quiz_lines).rstrip() + "\r\n")
            tf_quiz_name = tf_q.name

        with tempfile.NamedTemporaryFile("w", encoding="utf-8", newline="",
                                         dir=target_dir, delete=False) as tf_a:
            tf_a.write("\r\n".join(answer_lines).rstrip() + "\r\n")
            tf_ans_name = tf_a.name

        if os.path.exists(quiz_path):
            with tempfile.NamedTemporaryFile(dir=target_dir, delete=False) as tf_b:
                quiz_backup_temp = tf_b.name
            shutil.copy2(quiz_path, quiz_backup_temp)

        os.replace(tf_quiz_name, quiz_path);   tf_quiz_name = None
        try:
            os.replace(tf_ans_name, answer_path); tf_ans_name = None
        except Exception as e_ans:
            if quiz_backup_temp and os.path.exists(quiz_backup_temp):
                os.replace(quiz_backup_temp, quiz_path); quiz_backup_temp = None
            elif os.path.exists(quiz_path):
                os.remove(quiz_path)
            raise RuntimeError(f"교사용 정답지 교체 실패 → 전체 롤백: {e_ans}")

        if quiz_backup_temp and os.path.exists(quiz_backup_temp):
            try: os.remove(quiz_backup_temp)
            except Exception: pass

        safe_print(f"✅ [TXT 원자적 분리 완료]")
        safe_print(f"   👉 학생 배포용 : {quiz_path}  ({len(quiz_lines)} 줄)")
        safe_print(f"   👉 교사용      : {answer_path}  ({len(answer_lines)} 줄)")
        if used_enc != "utf-8":
            safe_print(f"   (원본 인코딩: {used_enc} → UTF-8 변환 저장)")
        return True

    except Exception as e:
        for tf in [tf_quiz_name, tf_ans_name, quiz_backup_temp]:
            if tf and os.path.exists(tf):
                try: os.remove(tf)
                except Exception: pass
        safe_print(f"❌ TXT 원자적 저장 실패 (롤백 완료): {e}")
        return False


# ════════════════════════════════════════════════════════════════════════════
# HWPX 엔진 (신규)
# ════════════════════════════════════════════════════════════════════════════

def _extract_para_text(para_el) -> str:
    """
    <hp:p> 요소에서 모든 <hp:t> 텍스트를 이어 반환.
    네임스페이스 URI({...}t) 와 무접두사(t) 둘 다 처리.
    """
    return ''.join(
        t.text
        for t in para_el.iter()
        if (t.tag.split('}')[-1] if '}' in t.tag else t.tag) == 't'
        and t.text
    )


def _parse_xml_preserve_ns(xml_bytes: bytes):
    """
    XML 파싱 + 네임스페이스 접두사 보존.
    [CRIT-HX-1] ET.tostring() 기본 동작은 ns0:/ns1: 으로 재명명하므로
    iterparse start-ns 이벤트로 원본 접두사를 캡처해 register_namespace 등록.
    """
    for _, (prefix, uri) in ET.iterparse(io.BytesIO(xml_bytes), events=['start-ns']):
        if prefix:
            ET.register_namespace(prefix, uri)
    return ET.fromstring(xml_bytes)


def _to_xml_bytes_standard(root) -> bytes:
    """
    구형 아래한글 뷰어 호환을 위한 표준 XML 선언(큰따옴표) 직렬화
    """
    body = ET.tostring(root, encoding='utf-8')
    return b'<?xml version="1.0" encoding="UTF-8"?>\n' + body


def _build_parent_map(root):
    """
    ElementTree 역방향 부모 맵 {child: parent} 구축.
    [WARN-HX-4] O(n) 단일 순회 — _find_parent O(n²) 교체.
    """
    return {child: parent for parent in root.iter() for child in list(parent)}


def _strip_all_paragraphs(root) -> int:
    """섹션 루트에서 모든 <hp:p> 를 제거. 제거 수 반환."""
    parent_map = _build_parent_map(root)
    paragraphs = root.findall('.//{*}p')
    removed = 0
    for para in paragraphs:
        parent = parent_map.get(para)
        if parent is not None:
            parent.remove(para)
            removed += 1
    return removed


def _repack_hwpx(src_zip: zipfile.ZipFile,
                 modified_files: dict,
                 out_path: str) -> None:
    """
    HWPX(OCF) 표준 재압축.
    [CRIT-HX-2] 'mimetype' 엔트리를 ZIP_STORED + 맨 앞으로 배치 (OCF 필수).
    modified_files = {arcname: bytes} 교체할 파일 지정.
    in-memory 조립 후 원자적 temp→replace.
    """
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, 'w', compression=zipfile.ZIP_DEFLATED) as out:
        # ① mimetype 선두 배치 — compress_type=ZIP_STORED 명시 필수
        if 'mimetype' in src_zip.namelist():
            data = modified_files.get('mimetype', src_zip.read('mimetype'))
            out.writestr('mimetype', data, compress_type=zipfile.ZIP_STORED)

        # ② 나머지: 원본 ZipInfo 메타데이터(날짜·플래그) 보존 + 교체 데이터 적용
        for info in src_zip.infolist():
            if info.filename == 'mimetype':
                continue
            data = modified_files.get(info.filename, src_zip.read(info.filename))
            out.writestr(info, data)

    # 원자적 기록
    tmp_dir = os.path.dirname(os.path.abspath(out_path))
    with tempfile.NamedTemporaryFile(dir=tmp_dir, delete=False, suffix='.tmp') as tf:
        tf_name = tf.name
        tf.write(buf.getvalue())
    os.replace(tf_name, out_path)


def split_quiz_file_hwpx(file_path: str) -> bool:
    """
    HWPX 분리 엔진.
    - Contents/section*.xml 을 번호순으로 탐색, 정답 패턴 첫 등장 위치 확정.
    - 학생용: 해당 문단 이후 모든 <hp:p> 제거 + 이후 섹션 전체 비움 → _학생용문제지.hwpx
    - 교사용: 원본 그대로 복사 → _교사용정답해설지.hwpx
    """
    if not zipfile.is_zipfile(file_path):
        safe_print(f"❌ HWPX 오류: ZIP 구조가 아닌 파일입니다: {file_path}")
        return False

    base_name, ext = os.path.splitext(file_path)
    student_path = f"{base_name}_학생용문제지{ext}"
    teacher_path = f"{base_name}_교사용정답해설지{ext}"
    target_dir   = os.path.dirname(os.path.abspath(file_path))
    tf_teacher   = None

    try:
        with zipfile.ZipFile(file_path, 'r') as zf:
            namelist = zf.namelist()

            section_files = sorted(
                [n for n in namelist
                 if re.match(r'Contents/section\d+\.xml$', n, re.IGNORECASE)],
                key=lambda x: int(re.search(r'(\d+)', x).group(1))
            )
            if not section_files:
                safe_print(f"❌ HWPX: Contents/section*.xml 없음: {file_path}")
                return False

            # ── 정답 위치 탐색 ───────────────────────────────────────────
            split_section  = None
            split_para_idx = -1
            split_sec_pos  = -1

            for sec_pos, sec_name in enumerate(section_files):
                xml_bytes = zf.read(sec_name)
                try:
                    root = _parse_xml_preserve_ns(xml_bytes)
                except ET.ParseError as pe:
                    safe_print(f"⚠️ XML 파싱 오류 ({sec_name}): {pe} — 건너뜀")
                    continue

                paragraphs = root.findall('.//{*}p')
                for idx, para in enumerate(paragraphs):
                    text = _extract_para_text(para).strip()
                    if text and _matches_split(text):
                        split_section  = sec_name
                        split_para_idx = idx
                        split_sec_pos  = sec_pos
                        safe_print(f"   🔍 정답 구분자 발견: [{sec_name}] {idx}번째 문단 "
                                    f"→ '{text[:50]}'")
                        break
                if split_section:
                    break

            if split_section is None:
                safe_print(f"⚠️ HWPX: 정답/해설 구분자 미발견 — 원본 유지: {file_path}")
                return False
            if split_para_idx <= 0:
                safe_print(f"⚠️ HWPX: [분리 중단] 구분자가 문서 첫 문단({split_para_idx}) "
                           f"→ 학생용이 비어 있음")
                return False

            # ── 학생용 XML 생성: 정답 이후 문단 제거 ────────────────────
            xml_bytes  = zf.read(split_section)
            root       = _parse_xml_preserve_ns(xml_bytes)
            parent_map = _build_parent_map(root)
            paragraphs = root.findall('.//{*}p')

            removed = 0
            for para in paragraphs[split_para_idx:]:
                parent = parent_map.get(para)
                if parent is not None:
                    parent.remove(para)
                    removed += 1

            modified_for_student = {
                split_section: _to_xml_bytes_standard(root)
            }

            # [WARN-HX-3] 기준 섹션 이후 section*.xml 전체 비움
            for later_sec in section_files[split_sec_pos + 1:]:
                try:
                    later_root = _parse_xml_preserve_ns(zf.read(later_sec))
                    _strip_all_paragraphs(later_root)
                    modified_for_student[later_sec] = _to_xml_bytes_standard(later_root)
                except ET.ParseError:
                    pass

            # ── HWPX 재압축 ─────────────────────────────────────────────
            _repack_hwpx(zf, modified_for_student, student_path)
            safe_print(f"   ✂️  학생용: 정답 이후 {removed}개 문단 제거 완료")

            # ── 교사용: 원본 원자적 복사 ─────────────────────────────────
            with tempfile.NamedTemporaryFile(dir=target_dir, delete=False, suffix='.tmp') as tf:
                tf_teacher = tf.name
            shutil.copy2(file_path, tf_teacher)
            os.replace(tf_teacher, teacher_path)
            tf_teacher = None

    except Exception as e:
        for p in [student_path]:
            if os.path.exists(p):
                try: os.remove(p)
                except Exception: pass
        if tf_teacher and os.path.exists(tf_teacher):
            try: os.remove(tf_teacher)
            except Exception: pass
        safe_print(f"❌ HWPX 분리 실패 (롤백 완료): {e}")
        return False

    safe_print(f"✅ [HWPX 원자적 분리 완료]")
    safe_print(f"   👉 학생 배포용 : {student_path}")
    safe_print(f"   👉 교사용      : {teacher_path}  (원본 보존)")
    return True


# ════════════════════════════════════════════════════════════════════════════
# 통합 진입점 (듀얼 엔진 라우터)
# ════════════════════════════════════════════════════════════════════════════
def split_quiz_file(file_path: str) -> bool:
    if not os.path.exists(file_path):
        safe_print(f"❌ 오류: 파일 없음: {file_path}")
        return False

    ext = os.path.splitext(file_path)[1].lower()

    if ext == '.hwpx':
        safe_print(f"📄 [HWPX 엔진] 처리 시작: {os.path.basename(file_path)}")
        return split_quiz_file_hwpx(file_path)
    elif ext in ('.txt', '.text', ''):
        safe_print(f"📄 [TXT 엔진] 처리 시작: {os.path.basename(file_path)}")
        return split_quiz_file_txt(file_path)
    else:
        safe_print(f"⚠️ 지원하지 않는 형식: '{ext}'  (.hwpx 또는 .txt 만 지원)")
        return False


if __name__ == "__main__":
    if len(sys.argv) < 2:
        safe_print("사용법: python -X utf8 split_quiz_and_answer.py <시험지파일경로(.txt|.hwpx)>")
        sys.exit(1)

    target_file = sys.argv[1].strip('"\'')
    success = split_quiz_file(target_file)
    sys.exit(0 if success else 1)

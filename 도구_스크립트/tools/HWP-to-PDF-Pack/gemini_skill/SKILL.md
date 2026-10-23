---
name: hwp-to-pdf
description: >-
  아래한글 문서(.hwp, .hwpx)를 정품 한컴오피스 COM 엔진을 통해 100% 무결점 PDF로 일괄 또는 단일 변환하는 천하무적 단수화 스킬.
  사용자가 HWP, HWPX 문서를 PDF로 변환해 달라고 요청하거나 특정 폴더 내 모든 한글 문서를 일괄 변환할 때 발동.
---

# 🛡️ [천하무적 단수화] 아래한글 ➔ PDF 무결점 자동 변환 스킬 (`hwp-to-pdf`)

본 스킬은 한컴오피스(한글 2018 / 2020 / 2022 / 2024 / 한컴독스) 전 버전을 아우르는 **단수화(All-in-One One-Shot) 변환 시스템**입니다. 
복잡한 설정이나 옵션 입력 없이, 단 한 줄의 명령만으로 작업 공간 내 모든 한글 문서를 원본 서식 100% 보존 상태로 PDF 변환합니다.

---

## ⚡ 3대 천하무적 아키텍처

1. **3대 레지스트리 경로 동시 자가치유 (Triple-Registry Auto-Healing)**:
   - `Software\HNC\HwpAutomation\Modules` (표준 오토메이션)
   - `Software\Hnc\HwpUserAction\Modules` (최신 패치 빌드)
   - `Software\HNC\HwpCtrl\Modules` (컨트롤/구형 빌드)
   - 세 곳에 자체 캡슐화된 보안 모듈(`FilePathCheckerModuleExample.dll`)을 동시 동기화하여, **어떤 버전이든 보안 승인 모달 팝업을 0%로 영구 차단**합니다.
2. **2단계 다이렉트 변환 폴백 (2-Tier Direct Fallback)**:
   - 1차: `SaveAs("PDF")` 초고속 다이렉트 변환
   - 2차(예외 시): 한컴 공식 내부 액션 `HAction.Execute("FileSaveAs", HFileOpenSave)` 파라미터 세트로 즉시 우회 구동하여 100% 변환 완주.
3. **완전 단수화 (One-Shot Automation)**:
   - 인자를 전혀 주지 않고 실행해도, **현재 작업 디렉토리와 모든 하위 폴더를 자동 스캔하여 모든 `.hwp`, `.hwpx` 문서를 즉시 1:1 PDF로 일괄 변환**합니다.

---

## 🚀 사용법 (단 한 줄로 끝나는 단수화)

스크립트 경로: `C:\Users\gopdmz0912\.gemini\config\skills\hwp-to-pdf\scripts\convert_hwp_to_pdf.py`

### 1. 단수화 실행 (현재 폴더 전체 일괄 변환 - 추천 ⭐)
```powershell
python "C:\Users\gopdmz0912\.gemini\config\skills\hwp-to-pdf\scripts\convert_hwp_to_pdf.py"
```
* 현재 위치의 모든 `.hwp`, `.hwpx` 파일과 하위 폴더까지 재귀적으로 자동 탐색하여 동일 위치에 `.pdf`를 생성합니다. (이미 변환된 파일은 스마트 건너뛰기)

### 2. 특정 파일 또는 특정 디렉토리 지정
```powershell
# 단일 파일 변환
python "C:\Users\gopdmz0912\.gemini\config\skills\hwp-to-pdf\scripts\convert_hwp_to_pdf.py" "F:\아래한글\제안요청서.hwpx"

# 특정 디렉토리 지정 & 강제 덮어쓰기(-f)
python "C:\Users\gopdmz0912\.gemini\config\skills\hwp-to-pdf\scripts\convert_hwp_to_pdf.py" "F:\문서보관소" -f
```

---

## 🤖 에이전트 자연어 상시 발동 규칙
사용자가 아래와 같은 요청을 할 때 본 스킬을 즉시 실행합니다:
* *"이 폴더 한글 파일들 PDF로 바꿔줘"*
* *"아래한글 PDF로 일괄 변환해"*
* *"제안요청서.hwpx PDF로 변환"*
* *"천하무적 변환 돌려"*

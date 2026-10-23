# hanuri-teacher-assistant_파견팩

**목적**: 선생님 PC에 AI 스킬을 설치하는 패키지입니다. 설치 후 AI가 선생님의 작업 방식을 따라 파일을 다룹니다.

**주요 파일**
- `0_원클릭_미종샘_PC_스킬설치기.bat`: 선생님이 더블클릭해서 설치하는 파일
- `install_hanuri_skill.py`: 실제 설치를 수행하는 스크립트
- `SKILL.md`: AI에게 주는 작업 안내서
- `scripts/`: 작업 도구 모음
  - `clean_pptx_caption.py`: PPT 캡션 제거
  - `create_memory_card.py`: 작업 기억카드 만들기
  - `fix_a4_layout.py`: A4 조판 맞추기
  - `organize_books_excel.py`: 도서목록 엑셀 정리
  - `split_quiz_and_answer.py`: 문제지와 정답지 나누기

**알아둘 점**: 이 폴더와 [01_선생님_전달자료의 zip](../../01_선생님_전달자료/hanuri-teacher-assistant_파견팩.zip)은 내용이 조금 다릅니다. 배포 전에 어느 쪽이 최신인지 확인이 필요합니다.

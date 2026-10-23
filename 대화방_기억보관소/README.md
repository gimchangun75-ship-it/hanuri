# 대화방_기억보관소

**목적**: 대화 기록을 날짜별로 정리하고, 온톨로지 데이터를 만드는 자동 동기화 폴더입니다.

**주요 파일**
- `일별대화/`: 날짜별 대화 기록 (`2026-10-17_대화기록.md`처럼 저장)
- `ontology_data.js`: 온톨로지 데이터 (자동 생성)
- `대화검색기.html`: 대화 기록 검색 화면
- `build_memory_archive.py`: 기록을 묶어 보관하는 스크립트
- `sync_job.py`, `sync_task.bat`, `run_sync_silent.vbs`: 10분마다 실행되는 동기화 작업
- `sync_log.txt`: 동기화 기록

**주의**
- 대화 내용이 들어 있으므로 외부에 공유하지 않습니다.
- `sync_job.py`와 `sync_task.bat`은 `D:\기억보관소\sync_daily_memory.js`를 부릅니다. 이 파일은 이 폴더 안에 없습니다.
- `sync_log.txt`는 계속 커집니다.

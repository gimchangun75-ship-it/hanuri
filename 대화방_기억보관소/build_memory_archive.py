import sys, os, json, glob, shutil
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')

# Paths
BASE_DIR = r'D:\한우리\대화방_기억보관소'
DAILY_SUBDIR = os.path.join(BASE_DIR, '일별대화')
VAULT_DAILY = r'D:\기억보관소\ontology_vault\Daily'
VAULT_RAW = r'D:\기억보관소\raw_daily'
GRAPH_INDEX_PATH = r'D:\기억보관소\graph_index.json'

os.makedirs(DAILY_SUBDIR, exist_ok=True)

# 1. Copy daily markdown files with friendly names
daily_files = sorted(glob.glob(os.path.join(VAULT_DAILY, '*.md')))
copied_count = 0
for df in daily_files:
    fname = os.path.basename(df) # e.g. 2026-10-22.md
    target_name = fname.replace('.md', '_대화기록.md')
    dst = os.path.join(DAILY_SUBDIR, target_name)
    shutil.copy2(df, dst)
    copied_count += 1

# 2. Collect all raw daily JSON sessions
raw_files = sorted(glob.glob(os.path.join(VAULT_RAW, '*.json')))
all_daily_data = {}

for rf in raw_files:
    date_str = os.path.basename(rf).replace('.json', '')
    try:
        with open(rf, 'r', encoding='utf-8', errors='ignore') as f:
            data = json.load(f)
        if isinstance(data, list):
            sessions = data
        elif isinstance(data, dict):
            sessions = data.get('sessions', [])
        else:
            sessions = []
        all_daily_data[date_str] = sessions
    except Exception as e:
        print(f"Error loading {rf}: {e}")

# 3. Load graph index
graph_index = {'nodes': [], 'edges': []}
if os.path.exists(GRAPH_INDEX_PATH):
    try:
        with open(GRAPH_INDEX_PATH, 'r', encoding='utf-8', errors='ignore') as f:
            graph_index = json.load(f)
    except Exception as e:
        print(f"Error loading {GRAPH_INDEX_PATH}: {e}")

# 4. Generate ontology_data.js
js_content = f"""// D:\\한우리\\대화방_기억보관소\\ontology_data.js
// 자동으로 생성된 온톨로지 대화 데이터베이스 (동기화: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')})

const ALL_DAILY_DATA = {json.dumps(all_daily_data, ensure_ascii=False)};
const GRAPH_INDEX = {json.dumps(graph_index, ensure_ascii=False)};
"""

js_path = os.path.join(BASE_DIR, 'ontology_data.js')
with open(js_path, 'wb') as f:
    f.write(js_content.encode('utf-8'))

print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] 동기화 완료: 일별 파일 {copied_count}개, 데이터 크기 {os.path.getsize(js_path):,} bytes")

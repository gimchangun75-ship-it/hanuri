# 주식회사 완좋아 한우리 1시간 무음 동기화 엔진
$src = "G:\내 드라이브\한우리"
$dst = "D:\한우리"
$log = "D:\한우리\sync_last.log"

$now = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

if (-not (Test-Path -LiteralPath $src)) {
    "[$now] [ERROR] 구글 드라이브 폴더를 찾을 수 없습니다: $src" | Set-Content -LiteralPath $log -Encoding UTF8
    exit 1
}

if (-not (Test-Path -LiteralPath $dst)) {
    New-Item -ItemType Directory -Path $dst -Force | Out-Null
}

"[$now] 한우리 구글 드라이브 동기화 시작..." | Set-Content -LiteralPath $log -Encoding UTF8

$robocopyArgs = @(
    $src,
    $dst,
    "/E",
    "/MT:16",
    "/FFT",
    "/R:1",
    "/W:1",
    "/NP",
    "/XO",
    "/NDL",
    "/XD", "`$RECYCLE.BIN", "System Volume Information", ".tmp.drivedownload", ".git",
    "/XF", "*.gdoc", "*.gsheet", "*.gslides"
)

& robocopy.exe @robocopyArgs | Out-File -FilePath $log -Append -Encoding UTF8

$doneTime = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
"[$doneTime] 한우리 구글 드라이브 동기화 완료! (ExitCode: $LASTEXITCODE)" | Out-File -FilePath $log -Append -Encoding UTF8

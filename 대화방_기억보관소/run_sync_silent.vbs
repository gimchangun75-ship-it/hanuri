' D:\한우리\대화방_기억보관소\run_sync_silent.vbs
' 10분 주기 대화 동기화 무소음(콘솔창 숨김) 실행기
Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd /c ""D:\한우리\대화방_기억보관소\sync_task.bat""", 0, True
Set WshShell = Nothing

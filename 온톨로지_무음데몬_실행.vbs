Set WshShell = CreateObject("WScript.Shell")
hanuriDir = "D:\" & ChrW(54620) & ChrW(50864) & ChrW(47532) & "\crawler"
WshShell.CurrentDirectory = hanuriDir
WshShell.Run "powershell.exe -NoProfile -WindowStyle Hidden -Command ""try { Invoke-RestMethod -Uri 'http://127.0.0.1:8089/status' -TimeoutSec 1 | Out-Null } catch { Start-Process -FilePath 'node' -ArgumentList 'watch_ontology_auto.js' -WorkingDirectory '" & hanuriDir & "' -WindowStyle Hidden }""", 0, False

$ErrorActionPreference = 'SilentlyContinue'
$out = @()
# Find the platypus agent process and its executable path
$procs = Get-Process | Where-Object { $_.ProcessName -like '*platypus*' -or $_.ProcessName -like '*python*' }
foreach ($p in $procs) {
  $out += "PROC $($p.ProcessName) PID $($p.Id) PATH $($p.Path)"
}
# Try to find platypus package dirs under common roots
$roots = @("$env:LOCALAPPDATA","$env:APPDATA","$env:USERPROFILE","C:\Program Files","C:\Program Files (x86)","C:\UnityProjects")
foreach ($r in $roots) {
  if (-not (Test-Path $r)) { continue }
  $hits = Get-ChildItem -Path $r -Recurse -Directory -Filter 'platypus' -Depth 5 2>$null
  foreach ($h in $hits) {
    $out += "PLATYPUS_DIR $($h.FullName)"
    $files = Get-ChildItem -Path $h.FullName -File 2>$null
    foreach ($f in $files) { $out += "   FILE $($f.Name)" }
  }
}
$out | Out-File -FilePath "C:\UnityProjects\RSP-EcomWeb\find-platypus.txt" -Encoding utf8
Write-Output "done"

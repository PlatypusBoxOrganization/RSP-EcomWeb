$ErrorActionPreference = 'SilentlyContinue'
$out = @()
$dir = "C:\Users\ADMIN\AppData\Local\Temp\_MEI000046302\platypus"
$all = Get-ChildItem -Path $dir -Recurse
foreach ($f in $all) { $out += "$($f.FullName)" }
$out | Out-File -FilePath "C:\UnityProjects\RSP-EcomWeb\find-platypus3.txt" -Encoding utf8
Write-Output "done $($all.Count) items"

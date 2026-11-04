$ErrorActionPreference = 'SilentlyContinue'
$out = @()
$dir = "C:\Users\ADMIN\AppData\Local\Temp\_MEI000046302\platypus"
$out += "DIR: $dir"
$files = Get-ChildItem -Path $dir -File
foreach ($f in $files) { $out += "FILE $($f.Name) SIZE $($f.Length)" }
# Also list the parent (site-packages area)
$parent = Split-Path $dir
$out += "PARENT: $parent"
$pfiles = Get-ChildItem -Path $parent -Directory
foreach ($d in $pfiles) { $out += "SUBDIR $($d.Name)" }
$out | Out-File -FilePath "C:\UnityProjects\RSP-EcomWeb\find-platypus2.txt" -Encoding utf8
Write-Output "done"

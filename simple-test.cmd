@echo off
echo Testing Node.js installation...
where node > node-path.txt 2>&1
type node-path.txt
del node-path.txt

if %ERRORLEVEL% EQU 0 (
    echo Node.js found in PATH
    node --version > node-version.txt 2>&1
    type node-version.txt
    del node-version.txt
) else (
    echo Node.js not found in PATH
)

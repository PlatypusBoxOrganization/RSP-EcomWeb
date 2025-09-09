@echo off
echo Testing Node.js environment...

echo.
echo 1. Checking Node.js installation...
node --version > node-version.txt 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed or not in PATH
    goto :end
)
type node-version.txt
del node-version.txt

echo.
echo 2. Creating test file...
echo console.log('Test successful!'); > test.js
node test.js > test-output.txt 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to run test script
    type test-output.txt
    goto :cleanup
)
echo ✅ Test script executed successfully
type test-output.txt

:cleanup
del test.js test-output.txt 2>nul

:end
echo.
pause

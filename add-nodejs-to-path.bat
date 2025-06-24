@echo off
echo Adding Node.js to System PATH...
echo.

REM Node.js path
set "nodejs_path=C:\Users\akhura28\Downloads\nodejs-portable\node-v20.10.0-win-x64"

REM Get current user PATH
for /f "skip=2 tokens=3*" %%a in ('reg query HKCU\Environment /v PATH 2^>nul') do set "current_path=%%b"

REM Check if already in PATH
echo %current_path% | findstr /i "%nodejs_path%" >nul
if %errorlevel% equ 0 (
    echo ✅ Node.js is already in your PATH!
    goto :test
)

REM Add to PATH
if defined current_path (
    set "new_path=%nodejs_path%;%current_path%"
) else (
    set "new_path=%nodejs_path%"
)

echo Adding Node.js to your user PATH...
reg add "HKCU\Environment" /v PATH /t REG_EXPAND_SZ /d "%new_path%" /f

if %errorlevel% equ 0 (
    echo ✅ Node.js successfully added to PATH!
    echo.
    echo ⚠️  IMPORTANT: Restart your PowerShell for changes to take effect.
) else (
    echo ❌ Failed to add Node.js to PATH.
)

:test
echo.
echo Testing Node.js...
"%nodejs_path%\node.exe" --version
"%nodejs_path%\npm.cmd" --version
echo.
echo After restarting PowerShell, you can run: npm --version
echo.
pause

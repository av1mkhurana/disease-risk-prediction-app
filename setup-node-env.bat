@echo off
echo Setting up Node.js environment...

REM Add Node.js to PATH for this session
set PATH=C:\Users\akhura28\Downloads\nodejs-portable\node-v20.10.0-win-x64;%PATH%

REM Test Node.js
echo Testing Node.js...
node --version
echo Testing npm...
npm --version

echo.
echo Node.js environment is ready!
echo You can now run npm commands in this terminal.
echo.

REM Keep the terminal open
cmd /k

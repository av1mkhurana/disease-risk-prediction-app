@echo off
echo Installing frontend dependencies...
echo.

REM Add Node.js to PATH for this session
set PATH=C:\Users\akhura28\Downloads\nodejs-portable\node-v20.10.0-win-x64;%PATH%

echo Testing Node.js setup...
node --version
npm --version
echo.

echo Installing dependencies in frontend folder...
cd frontend
npm install

echo.
if %ERRORLEVEL% EQU 0 (
    echo ✅ Dependencies installed successfully!
    echo You can now run start-dev.bat to start the development server.
) else (
    echo ❌ Installation failed. Check the error messages above.
    echo.
    echo 💡 Tip: Try running setup-node-env.bat first to set up Node.js environment
)
echo.
pause

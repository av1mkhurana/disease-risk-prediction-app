@echo off
echo Starting Disease Risk Prediction App - Development Server
echo.

REM Add Node.js to PATH for this session
set PATH=C:\Users\akhura28\Downloads\nodejs-portable\node-v20.10.0-win-x64;%PATH%

echo Testing Node.js setup...
node --version
npm --version
echo.

REM Check if node_modules exists
if not exist "frontend\node_modules" (
    echo ⚠️  Dependencies not installed yet.
    echo Please run install-deps.bat first to install dependencies.
    echo.
    pause
    exit /b 1
)

echo Starting React development server...
echo.
echo 🚀 Your app will open at: http://localhost:3000
echo 📊 Enhanced UI/UX with compelling health messaging
echo 🔒 Professional healthcare app design
echo.
echo Press Ctrl+C to stop the server
echo.

cd frontend
npm start

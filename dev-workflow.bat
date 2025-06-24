@echo off
title Disease Risk Prediction App - Development Workflow
color 0A

:MENU
cls
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║          Disease Risk Prediction App - Dev Workflow         ║
echo ╠══════════════════════════════════════════════════════════════╣
echo ║                                                              ║
echo ║  🚀 DEVELOPMENT COMMANDS:                                    ║
echo ║  [1] Install Dependencies (npm install)                     ║
echo ║  [2] Start Development Server (npm start)                   ║
echo ║                                                              ║
echo ║  📝 GIT COMMANDS:                                            ║
echo ║  [3] Check Git Status                                        ║
echo ║  [4] Commit Changes                                          ║
echo ║  [5] Push to GitHub                                          ║
echo ║                                                              ║
echo ║  ℹ️  INFORMATION:                                             ║
echo ║  [6] Show Git Configuration                                  ║
echo ║  [7] Show Node.js/NPM Versions                              ║
echo ║                                                              ║
echo ║  [0] Exit                                                    ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
set /p choice="Enter your choice (0-7): "

if "%choice%"=="1" goto INSTALL
if "%choice%"=="2" goto START
if "%choice%"=="3" goto STATUS
if "%choice%"=="4" goto COMMIT
if "%choice%"=="5" goto PUSH
if "%choice%"=="6" goto GITINFO
if "%choice%"=="7" goto NODEINFO
if "%choice%"=="0" goto EXIT
goto MENU

:INSTALL
cls
echo Installing frontend dependencies...
call install-deps.bat
goto MENU

:START
cls
echo Starting development server...
call start-dev.bat
goto MENU

:STATUS
cls
echo Checking Git status...
call git-status.bat
goto MENU

:COMMIT
cls
echo Committing changes...
call git-commit.bat
goto MENU

:PUSH
cls
echo Pushing to GitHub...
call git-push.bat
goto MENU

:GITINFO
cls
echo Git Configuration:
call git-setup.bat
goto MENU

:NODEINFO
cls
echo Node.js and NPM Information:
echo.
set NODE_PATH=C:\Users\akhura28\Downloads\nodejs-portable\node-v20.10.0-win-x64
echo Node.js Path: %NODE_PATH%
echo.
%NODE_PATH%\node.exe --version
%NODE_PATH%\npm.cmd --version
echo.
pause
goto MENU

:EXIT
echo.
echo Thanks for using Disease Risk Prediction App Dev Workflow!
echo.
pause
exit

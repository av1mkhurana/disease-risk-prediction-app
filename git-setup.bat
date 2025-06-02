@echo off
echo Setting up Git for Disease Risk Prediction App...
echo.

REM Set Git path
set GIT_PATH=C:\Users\akhura28\Downloads\PortableGit\bin\git.exe

REM Configure Git (replace with your details)
echo Configuring Git user...
%GIT_PATH% config --global user.name "Your Name"
%GIT_PATH% config --global user.email "your.email@example.com"

REM Set default branch to main
%GIT_PATH% config --global init.defaultBranch main

echo.
echo Git configuration complete!
echo.
echo Next steps:
echo 1. Edit this file to add your real name and email
echo 2. Run git-status.bat to check repository status
echo 3. Run git-commit.bat to commit your changes
echo.
pause

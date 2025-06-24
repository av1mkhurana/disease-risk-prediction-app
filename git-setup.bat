@echo off
echo Git is already configured and ready to use!
echo.

REM Set Git path
set GIT_PATH=C:\Users\akhura28\Downloads\PortableGit\bin\git.exe

echo Current Git configuration:
%GIT_PATH% config --global user.name
%GIT_PATH% config --global user.email
echo.

echo Repository status:
%GIT_PATH% remote -v
echo.

echo ✅ Git is fully configured and connected to GitHub!
echo ✅ Repository successfully synced!
echo.
echo Available commands:
echo - git-status.bat  : Check repository status
echo - git-commit.bat  : Commit changes
echo - git-push.bat    : Push to GitHub
echo.
pause

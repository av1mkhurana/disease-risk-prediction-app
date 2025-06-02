@echo off
echo Committing changes to Git repository...
echo.

set GIT_PATH=C:\Users\akhura28\Downloads\PortableGit\bin\git.exe

REM Add all changes
echo Adding all changes...
%GIT_PATH% add .

REM Get commit message from user
set /p message="Enter commit message: "

REM Commit with message
echo Committing changes...
%GIT_PATH% commit -m "%message%"

echo.
echo Commit complete! Use git-push.bat to push to GitHub.
echo.
pause

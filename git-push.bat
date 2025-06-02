@echo off
echo Pushing changes to GitHub...
echo.

set GIT_PATH=C:\Users\akhura28\Downloads\PortableGit\bin\git.exe

echo Pushing to GitHub repository...
echo You may be prompted for your GitHub username and password/token.
echo.

%GIT_PATH% push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo Push successful! Your changes are now on GitHub.
) else (
    echo Push failed. You may need to:
    echo 1. Set up your GitHub credentials
    echo 2. Create a Personal Access Token
    echo 3. Check your internet connection
)
echo.
pause

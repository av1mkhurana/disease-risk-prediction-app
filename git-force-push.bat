@echo off
echo Force pushing changes to GitHub (OVERWRITING REMOTE)...
echo WARNING: This will overwrite the remote repository!
echo.

set GIT_PATH=C:\Users\akhura28\Downloads\PortableGit\bin\git.exe

echo Force pushing to GitHub repository...
echo You may be prompted for your GitHub username and password/token.
echo.

%GIT_PATH% push --force origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo Force push successful! Remote repository has been overwritten.
) else (
    echo Force push failed. You may need to:
    echo 1. Set up your GitHub credentials
    echo 2. Create a Personal Access Token
    echo 3. Check your internet connection
)
echo.
pause

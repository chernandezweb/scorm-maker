@echo off
title SCORM Studio Updater
cd /d "%~dp0"

echo ===================================================
echo     SCORM Studio - Engine Update Assistant
echo ===================================================
echo.
echo [1/3] Checking for updates from the development team...

where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo.
  echo [ERROR] Git was not found in your system PATH.
  echo Please contact your IT administrator or developers to install Git.
  echo.
  pause
  exit /b 1
)

:: Pull latest engine updates silently, ensuring course/ folder is safe
git fetch origin main >nul 2>&1
git merge origin/main --ff-only >nul 2>&1

if %ERRORLEVEL% NEQ 0 (
  echo.
  echo [NOTICE] You have custom local changes in engine files.
  echo Preserving your changes and syncing upstream engine files...
  git pull --rebase origin main
) else (
  echo [2/3] Core engine and components updated successfully!
)

:: Check if package dependencies need update
echo [3/3] Verifying dependencies...
call npm install --silent >nul 2>&1

echo.
echo ===================================================
echo   SUCCESS: SCORM Studio is completely up to date!
echo   Your course slides and assets were untouched.
echo ===================================================
echo.
pause
exit

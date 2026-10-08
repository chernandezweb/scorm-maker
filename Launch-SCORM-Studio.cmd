@echo off
title SCORM Studio Launcher
cd /d "%~dp0"

echo ===================================================
echo   Starting SCORM Studio (AI-Powered E-Learning)
echo ===================================================
echo.

:: 1. Fast, silent engine update check from developers (non-blocking)
where git >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  echo [1/4] Checking for engine updates...
  git fetch origin main >nul 2>&1
  git merge origin/main --ff-only >nul 2>&1
)

:: 2. Check if node_modules exist, install silently if missing on first run
if not exist "node_modules\" (
  echo [2/4] First time setup: Initializing engine dependencies...
  call npm install --silent
) else (
  echo [2/4] Engine ready.
)

:: 3. Launch Vite preview server in background
echo [3/4] Launching live interactive stage...
start /b "" npm run dev > nul 2>&1

:: Wait 2 seconds for server to boot
timeout /t 2 /nobreak > nul

:: 4. Open VS Code in current course directory if available
where code >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  echo [4/4] Opening VS Code with Copilot Agent...
  start "" code .
)

:: 5. Launch standalone Desktop App window (Microsoft Edge App Mode - No URL bar, standalone feel)
echo.
echo Launching standalone app stage...
start msedge --app=http://localhost:5173/ || start chrome --app=http://localhost:5173/ || start http://localhost:5173/

echo.
echo ===================================================
echo   SCORM Studio is running!
echo   You can minimize this window.
echo ===================================================
exit

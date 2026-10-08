@echo off
title SCORM Studio Launcher
cd /d "%~dp0"

echo ===================================================
echo   Starting SCORM Studio (AI-Powered E-Learning)
echo ===================================================
echo.

:: 1. Check if node_modules exist, install silently if missing on first run
if not exist "node_modules\" (
  echo [1/3] First time setup: Initializing engine dependencies...
  call npm install --silent
) else (
  echo [1/3] Engine ready.
)

:: 2. Launch Vite preview server in background
echo [2/3] Launching live interactive stage...
start /b "" npm run dev > nul 2>&1

:: Wait 2 seconds for server to boot
timeout /t 2 /nobreak > nul

:: 3. Open VS Code in current course directory if available
where code >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  echo [3/3] Opening VS Code with Copilot Agent...
  start "" code .
)

:: 4. Launch standalone Desktop App window (Microsoft Edge App Mode - No URL bar, standalone feel)
echo.
echo Launching standalone app stage...
start msedge --app=http://localhost:5173/ || start chrome --app=http://localhost:5173/ || start http://localhost:5173/

echo.
echo ===================================================
echo   SCORM Studio is running!
echo   You can minimize this window.
echo ===================================================
exit

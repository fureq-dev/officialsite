@echo off
setlocal
cd /d "%~dp0"
title FUREQ - dev server

if not exist "node_modules" (
  echo node_modules was not found. Running setup first...
  call setup.bat
  if errorlevel 1 exit /b 1
)

echo Starting dev server. Close this window or press Ctrl+C to stop.
echo.

rem Open the browser after the server has had a moment to start
start "" cmd /c "timeout /t 4 /nobreak >nul & start http://localhost:4321/"

call npm run dev

echo.
pause
endlocal

@echo off
setlocal
cd /d "%~dp0"
title FUREQ - preview

if not exist "dist" (
  echo dist\ was not found. Building first...
  call build.bat
  if errorlevel 1 exit /b 1
)

echo Starting preview server. Close this window or press Ctrl+C to stop.
echo.

start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:4321/"

call npm run preview

echo.
pause
endlocal

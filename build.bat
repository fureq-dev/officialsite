@echo off
setlocal
cd /d "%~dp0"
title FUREQ - build

if not exist "node_modules" (
  echo node_modules was not found. Running setup first...
  call setup.bat
  if errorlevel 1 exit /b 1
)

echo Building static site into dist\ ...
echo.
call npm run build
if errorlevel 1 (
  echo.
  echo [ERROR] Build failed. See the messages above.
  pause
  exit /b 1
)

echo.
echo Build finished. Output: dist\
echo Run preview.bat to check the result locally.
echo.
pause
endlocal

@echo off
setlocal
cd /d "%~dp0"
title FUREQ - setup

echo ==========================================
echo  FUREQ site setup
echo ==========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js was not found.
  echo         Install Node.js 20 or later from https://nodejs.org/ and run this file again.
  echo.
  pause
  exit /b 1
)

for /f "tokens=*" %%v in ('node -v') do set NODE_VER=%%v
echo Node.js: %NODE_VER%
echo.

echo [1/3] Installing packages (npm install)...
call npm install
if errorlevel 1 (
  echo.
  echo [ERROR] npm install failed. Check your network connection and try again.
  pause
  exit /b 1
)
echo.

echo [2/3] Preparing .env ...
if exist ".env" (
  echo .env already exists. Skipped.
) else (
  copy /y ".env.example" ".env" >nul
  echo Created .env from .env.example.
  echo Edit .env and set the PUBLIC_GFORM_* values to enable the contact form.
)
echo.

echo [3/3] Checking images in public\ ...
set MISSING=0
if not exist "public\logo.png" ( echo   missing: public\logo.png & set MISSING=1 )
if not exist "public\icon.png" ( echo   missing: public\icon.png & set MISSING=1 )
if not exist "public\ogp-image.png" ( echo   missing: public\ogp-image.png & set MISSING=1 )
if "%MISSING%"=="0" echo All images found.
echo.

echo ==========================================
echo  Setup finished. Run dev.bat to start.
echo ==========================================
echo.
pause
endlocal

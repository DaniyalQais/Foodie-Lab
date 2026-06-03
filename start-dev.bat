@echo off
cd /d "%~dp0"
echo.
echo Foodie Lab - starting local server...
echo Open in browser: http://localhost:3000
echo Look for green bar: LOCAL DEV build send-picker-v8
echo.
call npm run dev:fresh

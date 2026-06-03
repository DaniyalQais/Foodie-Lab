@echo off
cd /d "%~dp0"
echo.
echo Foodie Lab - starting local server...
echo Open in browser: http://localhost:3000
echo Then open http://localhost:3000 on laptop or your Network IP on phone
echo.
call npm run dev:fresh

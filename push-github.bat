@echo off
cd /d "%~dp0"
git init
git add .
git status
git commit -m "first commit: Foodie Lab catering site"
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/DaniyalQais/Foodie-Lab.git
git push -u origin main
echo.
echo Done. If push failed, sign in to GitHub and run this file again.
pause

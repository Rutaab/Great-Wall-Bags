@echo off
echo Starting HoBags API server...
start "HoBags-API" cmd /c "cd /d "D:\Rutaab Ali Access\Hobags\HoBags\backend" && node server.js"
timeout /t 3 /nobreak >nul
echo Starting HoBags Frontend...
cd /d "D:\Rutaab Ali Access\Hobags\HoBags"
npm run dev

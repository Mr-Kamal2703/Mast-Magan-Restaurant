@echo off
cd /d "%~dp0"
start "Mast Magan Local Server" powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
echo Started local server in a new window.
echo Open http://127.0.0.1:8000/ in your browser.

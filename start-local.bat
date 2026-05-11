@echo off
cd /d "%~dp0"
start "Mast Magan Local Server" cmd /k "node server.js"
echo Started local server in a new window.
echo Open http://127.0.0.1:3000/ in your browser.

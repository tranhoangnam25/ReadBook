@echo off
setlocal

set "ROOT=%~dp0"
set "BACKEND_DIR=%ROOT%backend"
set "FRONTEND_DIR=%ROOT%frontend"

echo Starting backend...
start "online-bookstore-backend" cmd /k "cd /d "%BACKEND_DIR%" && call mvnw.cmd spring-boot:run"

echo Starting frontend...
start "online-bookstore-frontend" cmd /k "cd /d "%FRONTEND_DIR%" && call npm run dev"

echo.
echo Backend and frontend started in separate terminals.
echo Close those terminal windows to stop the apps.

endlocal

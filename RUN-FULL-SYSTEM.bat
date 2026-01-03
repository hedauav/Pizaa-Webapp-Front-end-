@echo off
echo ========================================
echo   SliceMaster Pizza - Full System
echo ========================================
echo.

cd /d "%~dp0SliceMaster-Backend"

echo [1/2] Starting Backend Server on port 8081...
start "SliceMaster Backend" cmd /k "java -jar target\pizzeria-backend-1.0.0.jar"

timeout /t 5 /nobreak >nul

echo [2/2] Opening Frontend...
start "" "%~dp0Pizaa-Webapp-Front-end-\index.html"

echo.
echo ========================================
echo   System Started Successfully!
echo ========================================
echo.
echo Backend:  http://localhost:8081/api/v1
echo Frontend: Opening in browser...
echo H2 Console: http://localhost:8081/h2-console
echo.
echo Press any key to stop the backend server...
pause >nul

echo.
echo Stopping backend server...
taskkill /F /FI "WINDOWTITLE eq SliceMaster Backend*"
echo Done!

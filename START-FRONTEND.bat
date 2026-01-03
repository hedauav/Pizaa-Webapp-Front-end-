@echo off
echo ========================================
echo  Starting SliceMaster Frontend Server
echo ========================================
echo.
echo Opening at http://localhost:5500
echo Press Ctrl+C to stop
echo.
cd /d "C:\Users\anish\OneDrive\Documents\Desktop\Pizza\Pizaa-Webapp-Front-end-"
python -m http.server 5500
pause

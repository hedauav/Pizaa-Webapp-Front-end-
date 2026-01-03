Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Starting SliceMaster Backend & Frontend" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Start Backend
Write-Host "[1/2] Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\anish\OneDrive\Documents\Desktop\Pizza\SliceMaster-Backend'; Write-Host 'Starting Backend on port 8081...' -ForegroundColor Green; C:\maven\apache-maven-3.9.9\bin\mvn.cmd spring-boot:run"

Start-Sleep -Seconds 3

# Start Frontend  
Write-Host "[2/2] Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\anish\OneDrive\Documents\Desktop\Pizza\Pizaa-Webapp-Front-end-'; Write-Host 'Starting Frontend on http://localhost:5500' -ForegroundColor Green; python -m http.server 5500"

Start-Sleep -Seconds 2

Write-Host "`n✓ Both servers starting in separate windows!" -ForegroundColor Green
Write-Host "`nWait 20-30 seconds, then open:" -ForegroundColor Cyan
Write-Host "  → http://localhost:5500`n" -ForegroundColor White

# Wait then open browser
Start-Sleep -Seconds 25
Start-Process "http://localhost:5500"

Write-Host "Browser opening... Happy testing! 🍕`n" -ForegroundColor Green
Read-Host "Press Enter to close this window"

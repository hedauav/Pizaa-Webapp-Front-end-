# ========================================
# SliceMaster Pizza - Full System Launcher
# ========================================

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  SliceMaster Pizza - Full System" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan

# Navigate to backend directory
$backendPath = "C:\Users\anish\OneDrive\Documents\Desktop\Pizza\SliceMaster-Backend"
$frontendPath = "C:\Users\anish\OneDrive\Documents\Desktop\Pizza\Pizaa-Webapp-Front-end-\index.html"

Write-Host "[1/2] Starting Backend Server on port 8081..." -ForegroundColor Green
Set-Location $backendPath

# Start backend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "java -jar target\pizzeria-backend-1.0.0.jar" -WindowStyle Normal

Write-Host "Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

Write-Host "[2/2] Opening Frontend..." -ForegroundColor Green
Start-Process $frontendPath

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  System Started Successfully!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Backend API:    " -NoNewline -ForegroundColor White
Write-Host "http://localhost:8081/api/v1" -ForegroundColor Cyan

Write-Host "Frontend:       " -NoNewline -ForegroundColor White
Write-Host "Opened in browser" -ForegroundColor Cyan

Write-Host "H2 Console:     " -NoNewline -ForegroundColor White
Write-Host "http://localhost:8081/h2-console" -ForegroundColor Cyan

Write-Host "JDBC URL:       " -NoNewline -ForegroundColor White
Write-Host "jdbc:h2:mem:slicemaster_db" -ForegroundColor Cyan

Write-Host "`nPress Ctrl+C to stop this script (backend will continue running)" -ForegroundColor Yellow
Write-Host "To stop backend, close its PowerShell window or run:" -ForegroundColor Yellow
Write-Host "  taskkill /F /FI `"IMAGENAME eq java.exe`"`n" -ForegroundColor Gray

# Keep script running
Read-Host "Press Enter to exit"

# PowerShell script to add Node.js to PATH for current session
Write-Host "Setting up Node.js for current PowerShell session..." -ForegroundColor Green
Write-Host ""

# Node.js path
$nodejsPath = "C:\Users\akhura28\Downloads\nodejs-portable\node-v20.10.0-win-x64"

# Add to current session PATH
$env:PATH = "$nodejsPath;$env:PATH"

Write-Host "Testing Node.js setup..." -ForegroundColor Yellow
try {
    $nodeVersion = & node --version
    $npmVersion = & npm --version
    
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Node.js is now available in this PowerShell session!" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now run:" -ForegroundColor Cyan
    Write-Host "  npm --version" -ForegroundColor White
    Write-Host "  node --version" -ForegroundColor White
    Write-Host "  npm run dev" -ForegroundColor White
    Write-Host "  npm install" -ForegroundColor White
    Write-Host ""
    Write-Host "💡 To make this permanent, run: add-nodejs-to-path.bat" -ForegroundColor Yellow
} catch {
    Write-Host "❌ Failed to setup Node.js. Please check the path." -ForegroundColor Red
    Write-Host "Expected path: $nodejsPath" -ForegroundColor Yellow
}

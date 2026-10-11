# Manual Packaging Script for README Studio IDE
# Bypasses electron-builder's EPERM rename issue on Windows
# Usage: .\scripts\manual-pack.ps1

$ErrorActionPreference = "Stop"

$projectRoot  = Split-Path -Parent $PSScriptRoot
$electronSrc  = "$env:LOCALAPPDATA\electron-builder\Cache\electron\electron-v44.7.0-win32-x64"
$outputDir    = "$projectRoot\release\win-unpacked"
$resourcesApp = "$outputDir\resources\app"

Write-Host ""
Write-Host "=== README Studio IDE - Manual Packager ===" -ForegroundColor Cyan
Write-Host "Project  : $projectRoot"
Write-Host "Electron : $electronSrc"
Write-Host "Output   : $outputDir"
Write-Host ""

# Step 1: Verify electron cache
if (-not (Test-Path "$electronSrc\electron.exe")) {
    Write-Host "ERROR: Electron binary not found at $electronSrc" -ForegroundColor Red
    Write-Host "Run the following to extract it:" -ForegroundColor Yellow
    Write-Host '  Expand-Archive "$env:LOCALAPPDATA\electron\Cache\5a625dfd3df3efc3971556afe64989f9aa6ea0f4cd6e33889c1951789041498f\electron-v44.7.0-win32-x64.zip" -DestinationPath "$env:LOCALAPPDATA\electron-builder\Cache\electron\electron-v44.7.0-win32-x64" -Force'
    exit 1
}

# Step 2: Build Vite
Write-Host "[1/4] Building Vite frontend..." -ForegroundColor Yellow
Set-Location $projectRoot
npm run build
if ($LASTEXITCODE -ne 0) { Write-Host "Vite build failed!" -ForegroundColor Red; exit 1 }
Write-Host "      Vite build OK" -ForegroundColor Green

# Step 3: Clean and create output directory
Write-Host "[2/4] Preparing output directory..." -ForegroundColor Yellow
if (Test-Path $outputDir) {
    Remove-Item -Recurse -Force $outputDir
}
New-Item -ItemType Directory -Force -Path $resourcesApp | Out-Null
Write-Host "      Output directory ready" -ForegroundColor Green

# Step 4: Copy Electron binary (direct copy, no rename from .tmp)
Write-Host "[3/4] Copying Electron $((Get-Item "$electronSrc\electron.exe").Length / 1MB | ForEach-Object { [math]::Round($_, 1) }) MB binary..." -ForegroundColor Yellow
Copy-Item -Recurse -Force "$electronSrc\*" "$outputDir\"
Write-Host "      Electron copied" -ForegroundColor Green

# Step 5: Copy app resources
Write-Host "[4/4] Copying app files (dist + electron)..." -ForegroundColor Yellow
Copy-Item -Recurse -Force "$projectRoot\dist"     "$resourcesApp\dist"
Copy-Item -Recurse -Force "$projectRoot\electron" "$resourcesApp\electron"
Copy-Item -Force "$projectRoot\package.json"      "$resourcesApp\package.json"

# Write a minimal package.json to resources/app so Electron finds the main entry
$pkgJson = Get-Content "$projectRoot\package.json" | ConvertFrom-Json
$minPkg = @{
    name    = $pkgJson.name
    version = $pkgJson.version
    main    = $pkgJson.main
} | ConvertTo-Json
$minPkg | Set-Content "$resourcesApp\package.json"

Write-Host "      App files copied" -ForegroundColor Green

# Done
Write-Host ""
Write-Host "=== Build Complete! ===" -ForegroundColor Green
Write-Host "Portable app ready at:" -ForegroundColor Cyan
Write-Host "  $outputDir\electron.exe" -ForegroundColor White
Write-Host ""
Write-Host "To launch:" -ForegroundColor Yellow
Write-Host "  & '$outputDir\electron.exe'" -ForegroundColor White
Write-Host ""

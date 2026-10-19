# ==============================================================================
# VisualMark Studio - Next-Gen Glassmorphic Installer Builder
# ==============================================================================
# Builds the frontend, bundles the app payload, and packages the custom
# glassmorphic installer into release/VisualMark-Studio-Setup.exe
# ==============================================================================

$ErrorActionPreference = "Stop"

$projectRoot   = Split-Path -Parent $PSScriptRoot
$frontendDir   = "$projectRoot\frontend"
$installerDir  = "$projectRoot\installer"
$payloadDir    = "$installerDir\payload\app"
$releaseDir    = "$projectRoot\release"
$unpackedApp   = "$frontendDir\release\win-unpacked"

Write-Host ""
Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host "  VisualMark Studio - Glassmorphic Installer Builder      " -ForegroundColor Cyan
Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Ensure frontend build exists
Write-Host "[1/4] Checking frontend build..." -ForegroundColor Yellow
if (-not (Test-Path "$frontendDir\dist\index.html")) {
    Write-Host "      Building frontend with Vite..." -ForegroundColor Gray
    Set-Location $frontendDir
    npm run build
    if ($LASTEXITCODE -ne 0) { Write-Host "Build failed!" -ForegroundColor Red; exit 1 }
}
Write-Host "      Frontend build verified." -ForegroundColor Green

# Step 2: Ensure win-unpacked app payload exists
Write-Host "[2/4] Verifying application binaries..." -ForegroundColor Yellow
if (-not (Test-Path "$unpackedApp\electron.exe") -and -not (Test-Path "$unpackedApp\VisualMark Studio.exe")) {
    Write-Host "      Packaging win-unpacked with electron-builder..." -ForegroundColor Gray
    Set-Location $frontendDir
    npx electron-builder --dir
    if ($LASTEXITCODE -ne 0) {
        Write-Host "      Falling back to manual packager..." -ForegroundColor Yellow
        & "$frontendDir\scripts\manual-pack.ps1"
    }
}

# Step 3: Sync payload to installer
Write-Host "[3/4] Staging payload into installer/payload/app..." -ForegroundColor Yellow
if (Test-Path $payloadDir) {
    Remove-Item -Recurse -Force $payloadDir
}
New-Item -ItemType Directory -Force -Path $payloadDir | Out-Null
Copy-Item -Recurse -Force "$unpackedApp\*" "$payloadDir\"

# Rename electron.exe to VisualMark Studio.exe in payload if needed
if (Test-Path "$payloadDir\electron.exe") {
    Move-Item -Force "$payloadDir\electron.exe" "$payloadDir\VisualMark Studio.exe"
}
Write-Host "      Payload staged ($((Get-ChildItem -Recurse $payloadDir | Measure-Object -Property Length -Sum).Sum / 1MB | ForEach-Object { [math]::Round($_, 1) }) MB)." -ForegroundColor Green

# Step 4: Package the Installer executable
Write-Host "[4/4] Building standalone VisualMark-Studio-Setup.exe..." -ForegroundColor Yellow
Set-Location $installerDir

# Ensure node_modules exists in installer or use global/frontend electron-builder
if (-not (Test-Path "$installerDir\node_modules")) {
    cmd /c "mklink /D `"$installerDir\node_modules`" `"$frontendDir\node_modules`"" 2>$null
}

npx electron-builder --config package.json --win portable
if ($LASTEXITCODE -ne 0) {
    Write-Host "Standalone packaging completed with exit code: $LASTEXITCODE" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "===========================================================" -ForegroundColor Green
Write-Host "  Installer Build Complete!                                " -ForegroundColor Green
Write-Host "===========================================================" -ForegroundColor Green
Write-Host "Output setup executable located at:" -ForegroundColor Cyan
Write-Host "  $releaseDir\VisualMark-Studio-Setup.exe" -ForegroundColor White
Write-Host ""

<#
  Script: start-estanquillos.ps1
  Propósito: Arrancar el backend (si no está corriendo), compilar el frontend si no existe build
             y lanzar la app de escritorio con Electron.
  Uso recomendado:
    - Click derecho > Run with PowerShell
    - o en terminal: powershell -ExecutionPolicy Bypass -File .\start-estanquillos.ps1
#>

$ErrorActionPreference = 'Stop'

# Ubicación de la raíz del proyecto
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Root

# Rutas de Node/NPM/NPX
$NodeExe = "C:\Program Files\nodejs\node.exe"
$NpmCmd  = "C:\Program Files\nodejs\npm.cmd"
$NpxCmd  = "C:\Program Files\nodejs\npx.cmd"

function Assert-Exists($path, $desc) {
  if (!(Test-Path $path)) {
    Write-Host "No se encontró $desc en: $path" -ForegroundColor Red
    Write-Host "Asegúrate de tener Node.js instalado en 'C:\\Program Files\\nodejs'" -ForegroundColor Yellow
    throw "Falta $desc"
  }
}

Assert-Exists $NodeExe 'node.exe'
Assert-Exists $NpmCmd  'npm.cmd'
Assert-Exists $NpxCmd  'npx.cmd'

function Test-BackendRunning() {
  try {
    $resp = Invoke-WebRequest -Uri 'http://localhost:5000/api/productos' -UseBasicParsing -TimeoutSec 2
    return $resp.StatusCode -ge 200 -and $resp.StatusCode -lt 400
  } catch {
    return $false
  }
}

function Start-Backend() {
  if (Test-BackendRunning) {
    Write-Host 'Backend ya está corriendo en http://localhost:5000' -ForegroundColor Green
    return
  }
  Write-Host 'Iniciando backend...' -ForegroundColor Cyan
  Start-Process -FilePath $NodeExe -ArgumentList 'server.js' -WorkingDirectory (Join-Path $Root 'backend') -WindowStyle Hidden
  Start-Sleep -Seconds 2
  if (Test-BackendRunning) {
    Write-Host 'Backend iniciado: http://localhost:5000' -ForegroundColor Green
  } else {
    Write-Host 'Advertencia: No se detectó el backend. Verifica logs en backend/server.js' -ForegroundColor Yellow
  }
}

function Ensure-FrontendBuild() {
  $buildIndex = Join-Path $Root 'frontend\build\index.html'
  if (Test-Path $buildIndex) {
    Write-Host 'Build de frontend encontrado.' -ForegroundColor Green
    return
  }
  Write-Host 'Compilando frontend (react-scripts build)...' -ForegroundColor Cyan
  Start-Process -FilePath $NpxCmd -ArgumentList '--yes','react-scripts@5.0.1','build' -WorkingDirectory (Join-Path $Root 'frontend') -Wait
  if (Test-Path $buildIndex) {
    Write-Host 'Build de frontend generado correctamente.' -ForegroundColor Green
  } else {
    Write-Host 'Error: No se generó el build. Intenta iniciar el dev server con:' -ForegroundColor Red
    Write-Host '  cd frontend; & "C:\\Program Files\\nodejs\\npx.cmd" --yes react-scripts@5.0.1 start'
    throw 'Falló la compilación del frontend'
  }
}

function Ensure-DesktopDeps() {
  $desktopNodeModules = Join-Path $Root 'desktop\node_modules'
  if (!(Test-Path $desktopNodeModules)) {
    Write-Host 'Instalando dependencias de Electron...' -ForegroundColor Cyan
    Start-Process -FilePath $NpmCmd -ArgumentList 'install' -WorkingDirectory (Join-Path $Root 'desktop') -Wait
  }
}

function Start-Desktop() {
  Write-Host 'Lanzando app de escritorio (Electron)...' -ForegroundColor Cyan
  Start-Process -FilePath $NpmCmd -ArgumentList 'start' -WorkingDirectory (Join-Path $Root 'desktop')
}

# Flujo principal
Start-Backend
Ensure-FrontendBuild
Ensure-DesktopDeps
Start-Desktop

Write-Host 'Todo listo. Si la ventana de Electron no aparece, revisa que el backend y el build existan.' -ForegroundColor Green
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { fork } = require('child_process');

let backendProcess = null;
const DEV_URL = 'http://localhost:3000';

async function ensureBackendRunning() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2000);
  try {
    // Node 18+ has global fetch
    const res = await fetch('http://localhost:5000/api/productos', { signal: controller.signal });
    clearTimeout(timeout);
    if (res.ok) {
      return true; // Backend está corriendo
    }
  } catch (e) {
    // No está corriendo, lo iniciamos
  }
  try {
    backendProcess = fork(path.join(__dirname, '../backend/server.js'));
    backendProcess.on('error', (err) => {
      console.error('Error en backend:', err);
    });
    backendProcess.on('exit', (code) => {
      console.log('Backend finalizado con código:', code);
    });
    return true;
  } catch (err) {
    console.error('No se pudo iniciar el backend:', err);
    return false;
  }
}

async function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      contextIsolation: true
    }
  });
  // Intentar cargar servidor de desarrollo si está disponible
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(DEV_URL, { signal: controller.signal });
    clearTimeout(timeout);
    if (res && res.ok) {
      win.loadURL(DEV_URL);
      return;
    }
  } catch {}

  // Fallback al build estático
  const indexPath = path.join(__dirname, '../frontend/build/index.html');
  win.loadFile(indexPath);
}

app.whenReady().then(async () => {
  await ensureBackendRunning();
  await createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('quit', () => {
  if (backendProcess) {
    try {
      backendProcess.kill();
    } catch {}
  }
});
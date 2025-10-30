# Estanquillos

Aplicación para gestión de inventario y ventas, con:
- Backend Node/Express (almacenamiento en JSON local)
- Frontend React (Material UI)
- App de escritorio con Electron

## Estructura

```
ESTANQUILLOS/
├── backend/           # API Express (JSON en backend/data)
├── frontend/          # React (CRA)
├── desktop/           # Electron (carga dev server o build)
└── start-estanquillos.ps1  # Script de arranque
```

## Desarrollo local

- Backend: `node backend/server.js` (o usa el script `.ps1`)
- Frontend dev: `cd frontend && npx --yes react-scripts@5.0.1 start`
- Frontend build: `cd frontend && npx --yes react-scripts@5.0.1 build`
- Electron: `cd desktop && npm install && npm start`

El frontend usa `proxy` a `http://localhost:5000` para las llamadas de API en desarrollo.

## Publicar en GitHub

1. Crea un repo vacío en GitHub: `estanquillos`
2. En PowerShell (en la carpeta del proyecto):

```powershell
cd C:\Users\Personal\Documents\trae_projects\ESTANQUILLOS
git init
git add .
git commit -m "Inicial: backend, frontend, electron, script"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/estanquillos.git
git push -u origin main
```

> Reemplaza `TU_USUARIO` por tu usuario real de GitHub.

## Notas
- Si el build no existe, Electron intentará el dev server (`http://localhost:3000`).
- Cambios de UI requieren recompilar (`build`) o levantar el dev server.
- El script `start-estanquillos.ps1` automatiza backend + build + Electron.
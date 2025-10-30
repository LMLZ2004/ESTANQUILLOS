const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.get('/', (req, res) => {
  res.send('API de Estanquillos funcionando correctamente');
});

// Verificar que exista la carpeta data y el archivo productos.json
const dataDir = path.join(__dirname, 'data');
const productosFile = path.join(dataDir, 'productos.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(productosFile)) {
  fs.writeFileSync(productosFile, '[]', 'utf8');
}

// Rutas de API
app.use('/api/productos', require('./routes/productos'));

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  console.log(`API disponible en http://localhost:${PORT}`);
});
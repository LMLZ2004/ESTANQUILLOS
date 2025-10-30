const fs = require('fs');
const path = require('path');

const productosFilePath = path.join(__dirname, '../data/productos.json');

// Función auxiliar para leer el archivo JSON
const getProductos = () => {
  try {
    const data = fs.readFileSync(productosFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer el archivo de productos:', error);
    return [];
  }
};

// Función auxiliar para escribir en el archivo JSON
const saveProductos = (productos) => {
  try {
    fs.writeFileSync(productosFilePath, JSON.stringify(productos, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error al guardar el archivo de productos:', error);
    return false;
  }
};

// Obtener todos los productos
exports.getProductos = (req, res) => {
  try {
    const productos = getProductos();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener productos', error: error.message });
  }
};

// Obtener un producto por ID
exports.getProductoById = (req, res) => {
  try {
    const productos = getProductos();
    const producto = productos.find(p => p.id === req.params.id);
    
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    
    res.json(producto);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el producto', error: error.message });
  }
};

// Crear un nuevo producto
exports.createProducto = (req, res) => {
  try {
    const productos = getProductos();
    
    // Generar un nuevo ID
    const newId = (productos.length > 0) 
      ? String(Math.max(...productos.map(p => parseInt(p.id))) + 1) 
      : '1';
    
    const nuevoProducto = {
      id: newId,
      ...req.body,
      fechaCreacion: new Date().toISOString(),
      ultimaActualizacion: new Date().toISOString()
    };
    
    productos.push(nuevoProducto);
    
    if (saveProductos(productos)) {
      res.status(201).json(nuevoProducto);
    } else {
      res.status(500).json({ mensaje: 'Error al guardar el producto' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear el producto', error: error.message });
  }
};

// Actualizar un producto
exports.updateProducto = (req, res) => {
  try {
    const productos = getProductos();
    const index = productos.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    
    const productoActualizado = {
      ...productos[index],
      ...req.body,
      ultimaActualizacion: new Date().toISOString()
    };
    
    productos[index] = productoActualizado;
    
    if (saveProductos(productos)) {
      res.json(productoActualizado);
    } else {
      res.status(500).json({ mensaje: 'Error al actualizar el producto' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el producto', error: error.message });
  }
};

// Eliminar un producto
exports.deleteProducto = (req, res) => {
  try {
    const productos = getProductos();
    const filteredProductos = productos.filter(p => p.id !== req.params.id);
    
    if (productos.length === filteredProductos.length) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    
    if (saveProductos(filteredProductos)) {
      res.json({ mensaje: 'Producto eliminado correctamente' });
    } else {
      res.status(500).json({ mensaje: 'Error al eliminar el producto' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el producto', error: error.message });
  }
};
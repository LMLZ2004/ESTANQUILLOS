import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';

// Datos de ejemplo para productos
const productosDisponibles = [
  { 
    id: 1, 
    codigosPrincipales: ['P001', 'B001'], 
    codigosSecundarios: ['X001'], 
    nombre: 'Refresco Cola', 
    categoria: 'Bebidas', 
    precios: {
      publico: 15.50,
      distribuidor: 12.00,
      preferencial: 13.50
    }, 
    stock: 100 
  },
  { 
    id: 2, 
    codigosPrincipales: ['P002'], 
    codigosSecundarios: [], 
    nombre: 'Papas Fritas', 
    categoria: 'Snacks', 
    precios: {
      publico: 12.00,
      distribuidor: 9.50,
      preferencial: 10.50
    }, 
    stock: 50 
  },
  { 
    id: 3, 
    codigosPrincipales: ['P003', 'D001'], 
    codigosSecundarios: [], 
    nombre: 'Chocolate', 
    categoria: 'Dulces', 
    precios: {
      publico: 8.50,
      distribuidor: 6.00,
      preferencial: 7.00
    }, 
    stock: 75 
  }
];

export default function Ventas() {
  const [codigoBarras, setCodigoBarras] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [carrito, setCarrito] = useState([]);
  const [tipoCliente, setTipoCliente] = useState('publico');
  const [cliente, setCliente] = useState({
    nombre: '',
    telefono: '',
    direccion: ''
  });

  // Función para buscar producto por código de barras
  const buscarProducto = (codigo) => {
    return productosDisponibles.find(producto => 
      producto.codigosPrincipales.includes(codigo) || 
      (producto.codigosSecundarios && producto.codigosSecundarios.includes(codigo))
    );
  };

  // Función para agregar producto al carrito
  const agregarProducto = () => {
    if (!codigoBarras) return;
    
    const producto = buscarProducto(codigoBarras);
    if (!producto) {
      alert('Producto no encontrado');
      return;
    }

    // Obtener el precio según el tipo de cliente
    const precioUnitario = producto.precios[tipoCliente];
    
    // Verificar si el producto ya está en el carrito
    const productoEnCarrito = carrito.find(item => item.producto.id === producto.id);
    
    if (productoEnCarrito) {
      // Actualizar cantidad si ya existe
      const nuevaCantidad = productoEnCarrito.cantidad + parseInt(cantidad);
      const nuevoCarrito = carrito.map(item => 
        item.producto.id === producto.id 
          ? { 
              ...item, 
              cantidad: nuevaCantidad,
              subtotal: nuevaCantidad * precioUnitario
            } 
          : item
      );
      setCarrito(nuevoCarrito);
    } else {
      // Agregar nuevo producto al carrito
      setCarrito([
        ...carrito, 
        {
          producto,
          cantidad: parseInt(cantidad),
          precioUnitario,
          subtotal: parseInt(cantidad) * precioUnitario
        }
      ]);
    }
    
    // Limpiar campos
    setCodigoBarras('');
    setCantidad(1);
  };

  // Función para eliminar producto del carrito
  const eliminarProducto = (id) => {
    setCarrito(carrito.filter(item => item.producto.id !== id));
  };

  // Calcular totales
  const subtotal = carrito.reduce((total, item) => total + item.subtotal, 0);
  const impuestos = subtotal * 0.16; // 16% de impuestos
  const total = subtotal + impuestos;

  // Función para manejar cambios en los datos del cliente
  const handleClienteChange = (e) => {
    const { name, value } = e.target;
    setCliente({
      ...cliente,
      [name]: value
    });
  };

  // Función para finalizar venta
  const finalizarVenta = () => {
    const venta = {
      cliente,
      productos: carrito,
      tipoCliente,
      subtotal,
      impuestos,
      total,
      fecha: new Date()
    };
    
    console.log('Venta finalizada:', venta);
    // Aquí se enviaría la venta al backend
    
    // Limpiar carrito y datos del cliente
    setCarrito([]);
    setCliente({
      nombre: '',
      telefono: '',
      direccion: ''
    });
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Punto de Venta
      </Typography>
      
      <Grid container spacing={3}>
        {/* Panel izquierdo - Agregar productos */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={5}>
                <TextField
                  label="Código de Barras"
                  fullWidth
                  value={codigoBarras}
                  onChange={(e) => setCodigoBarras(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      agregarProducto();
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Cantidad"
                  type="number"
                  fullWidth
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  InputProps={{ inputProps: { min: 1 } }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="contained"
                  startIcon={<AddShoppingCartIcon />}
                  onClick={agregarProducto}
                  fullWidth
                >
                  Agregar
                </Button>
              </Grid>
            </Grid>
          </Paper>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell align="right">Precio</TableCell>
                  <TableCell align="right">Cantidad</TableCell>
                  <TableCell align="right">Subtotal</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {carrito.map((item) => (
                  <TableRow key={item.producto.id}>
                    <TableCell>{item.producto.nombre}</TableCell>
                    <TableCell align="right">${item.precioUnitario.toFixed(2)}</TableCell>
                    <TableCell align="right">{item.cantidad}</TableCell>
                    <TableCell align="right">${item.subtotal.toFixed(2)}</TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        color="error"
                        onClick={() => eliminarProducto(item.producto.id)}
                      >
                        <DeleteIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {carrito.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No hay productos en el carrito
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Panel derecho - Información de venta */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tipo de Cliente
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Seleccione tipo de cliente</InputLabel>
                <Select
                  value={tipoCliente}
                  label="Seleccione tipo de cliente"
                  onChange={(e) => setTipoCliente(e.target.value)}
                >
                  <MenuItem value="publico">Público General</MenuItem>
                  <MenuItem value="distribuidor">Distribuidor</MenuItem>
                  <MenuItem value="preferencial">Cliente Preferencial</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Información del Cliente
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="nombre"
                    label="Nombre"
                    fullWidth
                    value={cliente.nombre}
                    onChange={handleClienteChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="telefono"
                    label="Teléfono"
                    fullWidth
                    value={cliente.telefono}
                    onChange={handleClienteChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="direccion"
                    label="Dirección"
                    fullWidth
                    value={cliente.direccion}
                    onChange={handleClienteChange}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumen de Venta
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>${subtotal.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Impuestos (16%):</Typography>
                <Typography>${impuestos.toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6">${total.toFixed(2)}</Typography>
              </Box>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={finalizarVenta}
                disabled={carrito.length === 0}
              >
                Finalizar Venta
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
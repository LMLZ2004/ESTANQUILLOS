import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

// Datos de ejemplo para el inventario
const initialProducts = [
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
  },
  { 
    id: 4, 
    codigosPrincipales: ['P004'], 
    codigosSecundarios: ['B002'], 
    nombre: 'Agua Mineral', 
    categoria: 'Bebidas', 
    precios: {
      publico: 10.00,
      distribuidor: 7.50,
      preferencial: 8.50
    }, 
    stock: 120 
  },
  { 
    id: 5, 
    codigosPrincipales: ['P005'], 
    codigosSecundarios: [], 
    nombre: 'Galletas', 
    categoria: 'Snacks', 
    precios: {
      publico: 14.00,
      distribuidor: 11.00,
      preferencial: 12.00
    }, 
    stock: 60 
  },
];

export default function Inventario() {
  const [products, setProducts] = useState(initialProducts);
  const [open, setOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    codigosPrincipales: [''],
    codigosSecundarios: [''],
    nombre: '',
    categoria: '',
    precios: {
      publico: '',
      distribuidor: '',
      preferencial: ''
    },
    stock: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('precio_')) {
      const precioType = name.split('_')[1];
      setNewProduct({
        ...newProduct,
        precios: {
          ...newProduct.precios,
          [precioType]: value
        }
      });
    } else if (name === 'codigoPrincipal') {
      setNewProduct({
        ...newProduct,
        codigosPrincipales: [value]
      });
    } else if (name === 'codigoSecundario') {
      setNewProduct({
        ...newProduct,
        codigosSecundarios: [value]
      });
    } else {
      setNewProduct({
        ...newProduct,
        [name]: value
      });
    }
  };

  const handleAddProduct = () => {
    const productToAdd = {
      id: products.length + 1,
      ...newProduct,
      precios: {
        publico: parseFloat(newProduct.precios.publico),
        distribuidor: parseFloat(newProduct.precios.distribuidor),
        preferencial: parseFloat(newProduct.precios.preferencial)
      },
      stock: parseInt(newProduct.stock)
    };
    
    setProducts([...products, productToAdd]);
    setNewProduct({
      codigosPrincipales: [''],
      codigosSecundarios: [''],
      nombre: '',
      categoria: '',
      precios: {
        publico: '',
        distribuidor: '',
        preferencial: ''
      },
      stock: ''
    });
    handleClose();
  };

  const filteredProducts = products.filter(product => 
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.codigosPrincipales.some(code => code.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.codigosSecundarios && product.codigosSecundarios.some(code => code.toLowerCase().includes(searchTerm.toLowerCase()))) ||
    product.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Inventario
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          Agregar Producto
        </Button>
      </Box>

      <TextField
        label="Buscar producto"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="tabla de inventario">
          <TableHead>
            <TableRow>
              <TableCell>Códigos</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell align="right">Precio Público ($)</TableCell>
              <TableCell align="right">Precio Distribuidor ($)</TableCell>
              <TableCell align="right">Precio Preferencial ($)</TableCell>
              <TableCell align="right">Stock</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow
                key={product.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Typography variant="body2" fontWeight="bold">Principales:</Typography>
                  {product.codigosPrincipales.join(', ')}
                  {product.codigosSecundarios && product.codigosSecundarios.length > 0 && (
                    <>
                      <Typography variant="body2" fontWeight="bold" sx={{ mt: 1 }}>Secundarios:</Typography>
                      {product.codigosSecundarios.join(', ')}
                    </>
                  )}
                </TableCell>
                <TableCell>{product.nombre}</TableCell>
                <TableCell>{product.categoria}</TableCell>
                <TableCell align="right">{product.precios.publico.toFixed(2)}</TableCell>
                <TableCell align="right">{product.precios.distribuidor.toFixed(2)}</TableCell>
                <TableCell align="right">{product.precios.preferencial.toFixed(2)}</TableCell>
                <TableCell align="right">{product.stock}</TableCell>
                <TableCell align="center">
                  <Button size="small" color="primary">Editar</Button>
                  <Button size="small" color="error">Eliminar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo para agregar nuevo producto */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Agregar Nuevo Producto</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Códigos de Barras</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="codigoPrincipal"
                label="Código Principal"
                variant="outlined"
                fullWidth
                value={newProduct.codigosPrincipales[0] || ''}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="codigoSecundario"
                label="Código Secundario (opcional)"
                variant="outlined"
                fullWidth
                value={newProduct.codigosSecundarios[0] || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="nombre"
                label="Nombre del Producto"
                variant="outlined"
                fullWidth
                value={newProduct.nombre}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="categoria"
                label="Categoría"
                variant="outlined"
                fullWidth
                value={newProduct.categoria}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Precios</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="precio_publico"
                label="Precio Público ($)"
                variant="outlined"
                fullWidth
                type="number"
                value={newProduct.precios.publico}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="precio_distribuidor"
                label="Precio Distribuidor ($)"
                variant="outlined"
                fullWidth
                type="number"
                value={newProduct.precios.distribuidor}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="precio_preferencial"
                label="Precio Preferencial ($)"
                variant="outlined"
                fullWidth
                type="number"
                value={newProduct.precios.preferencial}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="stock"
                label="Stock Inicial"
                variant="outlined"
                fullWidth
                type="number"
                value={newProduct.stock}
                onChange={handleInputChange}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button 
            onClick={handleAddProduct} 
            variant="contained" 
            color="primary"
            disabled={
              !newProduct.codigosPrincipales[0] || 
              !newProduct.nombre || 
              !newProduct.categoria || 
              !newProduct.precios.publico || 
              !newProduct.precios.distribuidor || 
              !newProduct.precios.preferencial || 
              !newProduct.stock
            }
          >
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
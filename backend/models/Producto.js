const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
  codigosPrincipales: [{
    type: String,
    required: true
  }],
  codigosSecundarios: [{
    type: String
  }],
  nombre: {
    type: String,
    required: true
  },
  descripcion: {
    type: String
  },
  categoria: {
    type: String,
    required: true
  },
  precios: {
    publico: {
      type: Number,
      required: true
    },
    distribuidor: {
      type: Number,
      required: true
    },
    preferencial: {
      type: Number,
      required: true
    }
  },
  costo: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  stockMinimo: {
    type: Number,
    default: 5
  },
  proveedor: {
    type: String
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  ultimaActualizacion: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Producto', ProductoSchema);
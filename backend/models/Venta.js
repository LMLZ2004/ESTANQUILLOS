const mongoose = require('mongoose');

const VentaSchema = new mongoose.Schema({
  numeroVenta: {
    type: String,
    required: true,
    unique: true
  },
  cliente: {
    nombre: String,
    telefono: String,
    direccion: String
  },
  productos: [
    {
      producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
      },
      cantidad: {
        type: Number,
        required: true
      },
      precioUnitario: {
        type: Number,
        required: true
      },
      subtotal: {
        type: Number,
        required: true
      }
    }
  ],
  subtotal: {
    type: Number,
    required: true
  },
  impuestos: {
    type: Number,
    default: 0
  },
  descuento: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  metodoPago: {
    type: String,
    enum: ['Efectivo', 'Tarjeta', 'Transferencia', 'Otro'],
    default: 'Efectivo'
  },
  estado: {
    type: String,
    enum: ['Completada', 'Pendiente', 'Cancelada'],
    default: 'Completada'
  },
  vendedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  notas: String
});

module.exports = mongoose.model('Venta', VentaSchema);
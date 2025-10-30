const mongoose = require('mongoose');

const RemisionSchema = new mongoose.Schema({
  numeroRemision: {
    type: String,
    required: true,
    unique: true
  },
  cliente: {
    nombre: {
      type: String,
      required: true
    },
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
  total: {
    type: Number,
    required: true
  },
  estado: {
    type: String,
    enum: ['Pendiente', 'Entregada', 'Cancelada'],
    default: 'Pendiente'
  },
  fechaEmision: {
    type: Date,
    default: Date.now
  },
  fechaEntrega: {
    type: Date
  },
  vendedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  notas: String
});

module.exports = mongoose.model('Remision', RemisionSchema);
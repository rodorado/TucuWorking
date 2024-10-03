const mongoose = require("mongoose");

const ReservaSchema = new mongoose.Schema({
  idUsuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  idSala: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sala",
    required: true,
  },
  fecha: {
    type: Date,
    required: true,
  },
  horarioInicio: {
    type: String,
    required: true,
  },
  horarioFin: {
    type: String,
    required: true,
  },
  cantidadPersonas: {
    type: Number,
    required: true,
  },
  estado: {
    type: String,
    enum: ["pendiente", "finalizado", "cancelado"],
    default: "pendiente",
  },
  precioTotal: {
    type: Number,
    required: true, // Corrige aquí si es necesario
  },
  preferenceId: { 
    type: String, // ID de la preferencia de Mercado Pago
  },
  paymentUrl: {  // URL para redirigir a Mercado Pago
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ReservasModels = mongoose.model("Reserva", ReservaSchema);
module.exports = ReservasModels;

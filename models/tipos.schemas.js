const mongoose = require('mongoose')

const TipoSalaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    enum: ["privada", "compartida", "reunion", "conferencia"],
    required: true,
  },
  categoriasDisponibles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categoria",
      required: true,
    },
  ],
});

const tipoModel = mongoose.model("tipo", TipoSalaSchema);
module.exports = tipoModel;

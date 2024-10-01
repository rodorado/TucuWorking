const mongoose = require("mongoose");


const SalasSchemas = new mongoose.Schema({
  nombre: {
    type: String,
    unique: true,
  },
  tipoDeSala: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tipo",
    required: true,
  },
  categoriaDeSala: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categoria",
    require: true,
  },
  capacidad: {
    type: Number,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  imagen: {
    type: String,
    default: "",
  },
  horariosDisponibles: [
    {
      fecha: {
        type: Date,
        required: true,
      },
      horaInicio: {
        type: String,
        required: true,
      },
      horaFin: {
        type: String,
        required: true,
      },
    },
  ],
  disponibilidad: {
    type: Boolean,
    required: true,
  },
});

SalasSchemas.pre('save', async function(next) {
    try {
      if (!this.nombre) {
        const lastSala = await this.constructor.findOne().sort({ _id: -1 });
        const lastNumber = lastSala ? parseInt(lastSala.nombre.replace('Sala ', '')) : 0;
        this.nombre = `Sala ${lastNumber + 1}`;
      }
      next();
    } catch (error) {
      next(error); 
    }
  });

const SalasModels = mongoose.model("sala", SalasSchemas);

module.exports = SalasModels;

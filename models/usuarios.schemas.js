const { Schema, Model, model } = require("mongoose");

const usuarioSchema = new Schema({
  nombreApellido: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contrasenia: {
    type: String,
    required: true,
    trim: true,
  },
  rol: {
    type: String,
    default: "usuario",
    enum: ["usuario", "admin"],
  },
  bloqueado: {
    type: Boolean,
    default: false,
  },
});

usuarioSchema.methods.toJSON = function () {
  const { contrasenia, __v, ...usuario } = this.toObject();
  return usuario;
};

const usuarioModel = model("usuario", usuarioSchema);
module.exports = usuarioModel;

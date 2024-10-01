const { Schema, model } = require('mongoose');

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
  tokenRecuperacion: {
    type: String, // Token de recuperación
  },
  expiracionToken: {
    type: Date, // Fecha de expiración del token
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

// Método para ocultar ciertos campos cuando se convierta el objeto a JSON
usuarioSchema.methods.toJSON = function () {
  const { contrasenia, __v, ...usuario } = this.toObject();
  return usuario;
};

const usuarioModel = model("usuario", usuarioSchema);
module.exports = usuarioModel;


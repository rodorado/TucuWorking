const { Schema, Model, model } = require('mongoose')

const usuarioSchema = new Schema({
    nombreApellido: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    contrasenia: {
        type: String,
        required: true,
        trim: true
    },
    rol: {
        type: String,
        default: 'usuario'
    },
    bloqueado: {
        type: Boolean,
        default: false
    }

})


const usuarioModel = model('usuario', usuarioSchema)
module.exports = usuarioModel
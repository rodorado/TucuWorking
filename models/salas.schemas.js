const mongoose = require('mongoose')

const SalasSchemas = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        required: true
    },
    capacidad: {
        type: Number,
        required: true
    },
    precio: {
        type: Number,
        required: true,
    },
    disponibilidad: {
        type: Boolean,
        required: true
    }
})

const SalasModels = mongoose.model('sala', SalasSchemas)

module.exports = SalasModels
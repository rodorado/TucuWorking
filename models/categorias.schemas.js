const mongoose = require('mongoose');

const CategoriaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    enum: ['economy', 'confort', 'premium'],
    required: true
  }
});

const CategoriasModels = mongoose.model('categoria', CategoriaSchema)
module.exports = CategoriasModels


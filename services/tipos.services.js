const tipoModel = require("../models/tipos.schemas");
const CategoriasModels = require("../models/categorias.schemas");
const mongoose = require('mongoose')


const obtenerTodosLosTipos = async () => {
  try {
    const traerTipos = await tipoModel.find();
    return traerTipos;
  } catch (error) {
    console.log(error);
  }
};

const obtenerUnTipo = async (id) => {
  try {
    const tipo = await tipoModel.findOne({ _id: id });
    return tipo || null; 
  } catch (error) {
    console.log(error);
    throw new Error('Error al buscar el tipo'); 
  }
};


const crearTipo = async (body) => {
  try {
    const categoriasIds = await CategoriasModels.find({
      nombre: { $in: body.categoriasDisponibles }
    }).select('_id'); 

    if (categoriasIds.length !== body.categoriasDisponibles.length) {
      throw new Error('Una o más categorías no son válidas');
    }

    const newTipo = new tipoModel({
      nombre: body.nombre,
      categoriasDisponibles: categoriasIds 
    });

    return await newTipo.save();
  } catch (error) {
    console.log(error);
    throw error; 
  }
};

// servicio para editar un tipo
async function editarUnTipo(id, data) {

  if (data.categoriasDisponibles) {
      data.categoriasDisponibles = data.categoriasDisponibles.map(categoria =>new mongoose.Types.ObjectId(categoria));
  }

  try {
      const tipoActualizado = await Tipo.findByIdAndUpdate( new mongoose.Types.ObjectId(id), data, { new: true });
      return tipoActualizado;
  } catch (error) {
      console.error(error);
      throw new Error('Error al actualizar el tipo');
  }
}

const borrarUnTipo = async (idTipo) => {
  try {
    await tipoModel.findByIdAndDelete({ _id: idTipo });
    return 200;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  obtenerTodosLosTipos,
  obtenerUnTipo,
  crearTipo,
  editarUnTipo,
  borrarUnTipo
};

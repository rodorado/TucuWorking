const tipoModel = require("../models/tipos.schemas");
const CategoriasModels = require("../models/categorias.schemas");


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

    if (categoriasIds.length === 0) {
      throw new Error('Ninguna categoría es válida');
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

const editarUnTipo = async (idTipo, body) => {
  const categoriasIds = await CategoriasModels.find({
    nombre: { $in: body.categoriasDisponibles } 
  }).select('_id');

  if (categoriasIds.length === 0) {
    throw new Error('Ninguna categoría válida encontrada');
  }

  body.categoriasDisponibles = categoriasIds.map(cat => cat._id);
  return await tipoModel.findByIdAndUpdate(idTipo, body, { new: true });
};

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

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
    // Buscar categorías en la base de datos que coincidan con las categorías proporcionadas
    const categoriasIds = await CategoriasModels.find({
      nombre: { $in: body.categoriasDisponibles }
    }).select('_id');

    // Si no se encuentra ninguna categoría, lanzar un error
    if (categoriasIds.length === 0) {
      throw new Error('Ninguna categoría es válida');
    }

    // Crear el nuevo tipo con las categorías válidas encontradas
    const newTipo = new tipoModel({
      nombre: body.nombre,
      categoriasDisponibles: categoriasIds  // Solo las categorías válidas se guardan
    });

    // Guardar el nuevo tipo en la base de datos
    return await newTipo.save();
  } catch (error) {
    console.log(error);  // Mostrar el error en la consola para depuración
    throw error;  // Volver a lanzar el error para que sea manejado por la función llamante
  }
};


// servicio para editar un tipo

const editarUnTipo = async (idTipo, body) => {
  const categoriasIds = await CategoriasModels.find({
    nombre: { $in: body.categoriasDisponibles } // Asumiendo que estás pasando nombres
  }).select('_id');

  // Verifica que haya al menos una categoría válida
  if (categoriasIds.length === 0) {
    throw new Error('Ninguna categoría válida encontrada');
  }

  // Asegúrate de que body contenga los IDs
  body.categoriasDisponibles = categoriasIds.map(cat => cat._id);

  // Luego, actualiza el tipo
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

const CategoriasModels = require("../models/categorias.schemas");

const obtenerTodasLasCategorias = async () => {
  try {
      const traerCategorias = await CategoriasModels.find();
      return traerCategorias;
    
  } catch (error) {
    console.log(error);
  }
};

const obtenerUnaCategoria = async () =>{
    try {
        const categoria = await CategoriasModels.findOne({_id: id})
        return categoria;
    } catch (error) {
        console.log(error)
    }
}

const crearCategoria = (body) => {
    try {
      const newCategoria = new CategoriasModels(body)
      return newCategoria
    } catch (error) {
      console.log(error);
    }
  };

  const editarUnaCategoria = async (idCategoria, data) => {
    try {
        const categoriaModificada = await CategoriasModels.findByIdAndUpdate({_id: idCategoria}, data, {new: true})
        return categoriaModificada
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const borrarUnaCategoria = async(idCategoria) => {
    try {
      await CategoriasModels.findByIdAndDelete({_id: idCategoria})
      return 200
    } catch (error) {
      console.log(error);
    }
  };





module.exports ={
    obtenerTodasLasCategorias,
    obtenerUnaCategoria,
    crearCategoria,
    editarUnaCategoria,
    borrarUnaCategoria
}
const categoriasServices = require("../services/categorias.services");
const { validationResult } = require("express-validator");

//GET
const obtenerUnaCategoriaPorIdOTodos = async (req, res) => {
  try {
    const id = req.params.idCategoria ? req.params.idCategoria : null;

    if (id !== null) {
      const categoria = await categoriasServices.obtenerUnaCategoria(id);
      if (categoria) {
        res.status(200).json(categoriasServices);
      } else {
        res.status(404).json({ mensaje: "Categoria no encontrada" });
      }
    } else {
      const categorias = await categoriasServices.obtenerTodasLasCategorias();
      res.status(200).json(categorias);
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la categorias" });
  }
};

// Controlador para crear una nueva categoria
const crearUnaCategoria = async (req, res) => {
  try {
    const { errors } = validationResult(req);

    if (errors.length) {
      return res.status(422).json({ message: errors[0].msg });
    }
    const nuevaCategoria = categoriasServices.crearCategoria(req.body);
    await nuevaCategoria.save();
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(500).json({ error: "Error al crear la categoria" });
  }
};

// Controlador para editar una categoria
const editarUnaCategoria = async(req, res) => {
    try {
      const { errors } = validationResult(req)
    
      if (errors.length) {
        return res.status(422).json({ message: errors[0].msg })
      }
      
      const id = req.params.idCategoria;
      const data = req.body;
  
      const categoriaEditada = await categoriasServices.editarUnaCategoria(id, data);
  
      if (categoriaEditada) {
        res.status(200).json(categoriaEditada);
      } else {
        res.status(404).json({ mensaje: "Categoria no encontrada" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error al editar la categoria" });
    }
  };
  
// Controlador para borrar una categoria
const borrarUnaCategoria = async (req, res) => {
    try {
      const id = req.params.idCategoria;
      const resultado = await categoriasServices.borrarUnaCategoria(id);
      res.status(200).json({ msg: "Categoria borrada con exito", resultado });
    } catch (error) {
      res.status(500).json({ error: "Error al borrar la categoria" });
    }
  };


module.exports = {
  obtenerUnaCategoriaPorIdOTodos,
  crearUnaCategoria,
  editarUnaCategoria,
  borrarUnaCategoria
};

const tiposServices = require("../services/tipos.services");
const { validationResult } = require("express-validator");

//GET
const obtenerUnTipoPorIdOTodos = async (req, res) => {
  try {
    const id = req.params.idTipo ? req.params.idTipo : null;

    if (id !== null) {
      const tipo = await tiposServices.obtenerUnTipo(id);
      if (tipo) {
        res.status(200).json(tipo); 
      } else {
        res.status(404).json({ mensaje: "Tipo de sala no encontrado" });
      }
    } else {
      const tipos = await tiposServices.obtenerTodosLosTipos();
      res.status(200).json(tipos);
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los tipos de sala" });
  }
};

//POST TIPOS
const crearUnTipo = async (req, res) => {
  try {
    const { errors } = validationResult(req);

    if (errors.length) {
      return res.status(422).json({ message: errors[0].msg });
    }
    
    const nuevoTipo = await tiposServices.crearTipo(req.body); 
    res.status(201).json(nuevoTipo);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error al crear el tipo de sala", detalles: error.message }); 
  }
};


// Controlador para editar un tipo
/*async function editarUnTipo(req, res) {
  const { id } = req.params; 

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); 
  }

  const data = req.body; 

  try {
      const tipoActualizado = await tiposServices.editarUnTipo(id, data); 
      if (!tipoActualizado) {
          return res.status(404).json({ message: 'Tipo no encontrado' }); 
      }
      res.status(200).json(tipoActualizado); 
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message }); 
  }
}*/

const editarUnTipo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Errores de validación:', errors.array());
    return res.status(400).json({ msg: errors.array() });
  }

  const idTipo = req.params.idTipo;
  console.log('ID del tipo a editar:', idTipo);

  try {
    const result = await tiposServices.editarUnTipo(idTipo, req.body);
    console.log('Resultado de la edición:', result);
    res.status(200).json({ msg: result.msg });
  } catch (error) {
    console.error('Error al editar el tipo:', error.message);
    res.status(500).json({ msg: error.message });
  }
};





//DELETE TIPOSa
const borrarUnTipo = async (req, res) => {
  try {
    const id = req.params.idTipo;
    const resultado = await tiposServices.borrarUnTipo(id);
    res.status(200).json({ msg: "Tipo de sala borrada con exito", resultado });
  } catch (error) {
    res.status(500).json({ error: "Error al borrar el tipo de sala" });
  }
};

module.exports = {
  obtenerUnTipoPorIdOTodos,
  crearUnTipo,
  editarUnTipo,
  borrarUnTipo
};

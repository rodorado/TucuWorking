const salasServices = require("../services/salas.services");


// Controlador para obtener una sala por id o todas
const obtenerUnaSalaPorIdOTodos = (req, res) => {
  try {
    const id = req.params.idSala ? Number(req.params.idSala) : null;

    if (id !== null) {
      const sala = salasServices.obtenerUnaSala(id);
      if (sala) {
        res.status(200).json(sala);
      } else {
        res.status(404).json({ mensaje: "Sala no encontrada" });
      }
    } else {
      const salas = salasServices.obtenerTodasLasSalas();
      res.status(200).json(salas);
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la sala" });
  }
};

// Controlador para crear una nueva sala
const crearUnaSala = (req, res) => {
  try {
    const nuevaSala = salasServices.crearSala(req.body);
    res.status(201).json(nuevaSala);
  } catch (error) {
    res.status(500).json({ error: "Error al crear la sala" });
  }
};

// Controlador para editar una sala
const editarUnaSala = (req, res) => {
  try {
    const id = Number(req.params.idSala);
    const data = req.body;

    const salaEditada = salasServices.editarUnaSala(id, data);

    if (salaEditada) {
      res.status(200).json(salaEditada);
    } else {
      res.status(404).json({ mensaje: "Sala no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ error: "Sala al editar la sala" });
  }
};

// Controlador para borrar una sala
const borrarUnaSala = (req, res) => {
  try {
    const id = Number(req.params.idSala);
    const resultado = salasServices.borrarUnaSala(id);
    res.status(200).json({ msg: "Sala borrada con exito", resultado });
  } catch (error) {
    res.status(500).json({ error: "Error al borrar la sala" });
  }
};

//Controlador de borrado logico para cambiar la disponibilidad de la sala
/*const disponibilidadDeUnaSala = (req, res) => {
  try {
    const id = req.params.idSala;

    // Asegurarse de que el id no es undefined o null
    if (!id) {
      return res.status(400).json({ error: "ID de sala no proporcionado" });
    }

    const result = salasServices.cambiarDisponibilidad(id);

    if (result) {
      // En caso de éxito
      return res.status(200).json({ message: result });
    } else {
      // Si cambiarDisponibilidad devuelve un resultado vacío o nulo
      return res.status(404).json({ error: "Sala no encontrada" });
    }

  } catch (error) {
    // Captura cualquier otro error
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};*/

const habilitarSala = async(req, res) => {
  const result =  await salasServices.habilitarSala(req.params.idSala)
  if(result.statusCode === 200){
    res.status(200).json({msg: result.msg})
   }else{
    res.status(500).json({msg: result.msg})
   }
}

const deshabilitarUnaSala = async(req, res) => {
  const result =  await salasServices.deshabilitarSala(req.params.idSala)
  if(result.statusCode === 200){
    res.status(200).json({msg: result.msg})
   }else{
    res.status(500).json({msg: result.msg})
   }
}



module.exports = {
  obtenerUnaSalaPorIdOTodos,
  crearUnaSala,
  editarUnaSala,
  borrarUnaSala,
  habilitarSala,
  deshabilitarUnaSala
};


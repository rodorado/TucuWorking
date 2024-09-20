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
const disponibilidadDeUnaSala = (req, res) =>{
  try {
    const id = req.params.idSala;
    const result = salasServices.cambiarDisponibilidad(id)
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({error: "no se encontró la sala"})
  }
}


module.exports = {
  obtenerUnaSalaPorIdOTodos,
  crearUnaSala,
  editarUnaSala,
  borrarUnaSala,
  disponibilidadDeUnaSala
};


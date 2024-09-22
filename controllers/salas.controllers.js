const salasServices = require("../services/salas.services");
const { validationResult } = require('express-validator')


// Controlador para obtener una sala por id o todas
const obtenerUnaSalaPorIdOTodos = async(req, res) => {
  try {
    const id = req.params.idSala ? req.params.idSala : null;

    if (id !== null) {
      const sala = await salasServices.obtenerUnaSala(id);
      if (sala) {
        res.status(200).json(sala);
      } else {
        res.status(404).json({ mensaje: "Sala no encontrada" });
      }
    } else {
      const salas = await salasServices.obtenerTodasLasSalas();
      res.status(200).json(salas);
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la sala" });
  }
};

// Controlador para crear una nueva sala
const crearUnaSala = async(req, res) => {
  try {
    const { errors } = validationResult(req)
  
    if (errors.length) {
      return res.status(422).json({ message: errors[0].msg })
    }
    const nuevaSala = await salasServices.crearSala(req.body);
    await nuevaSala.save()
    res.status(201).json(nuevaSala);
  } catch (error) {
    res.status(500).json({ error: "Error al crear la sala" });
  }
};

// Controlador para editar una sala
const editarUnaSala = async(req, res) => {
  try {
    const { errors } = validationResult(req)
  
    if (errors.length) {
      return res.status(422).json({ message: errors[0].msg })
    }
    
    const id = req.params.idSala;
    const data = req.body;

    const salaEditada = await salasServices.editarUnaSala(id, data);

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
const borrarUnaSala = async (req, res) => {
  try {
    const id = req.params.idSala;
    const resultado = await salasServices.borrarUnaSala(id);
    res.status(200).json({ msg: "Sala borrada con exito", resultado });
  } catch (error) {
    res.status(500).json({ error: "Error al borrar la sala" });
  }
};

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


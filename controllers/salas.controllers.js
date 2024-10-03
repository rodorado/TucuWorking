const salasServices = require("../services/salas.services");
const { validationResult } = require("express-validator");

//GET
const obtenerUnaSalaPorIdOTodos = async (req, res) => {
  try {
    const id = req.params.idSala ? req.params.idSala : null;
    const limit = req.query.limit || 10;
    const to = req.query.to || 0;
    const verDeshabilitadas = req.query.verDeshabilitadas === "true";

    if (id) {
      const sala = await salasServices.obtenerUnaSala(id);
      res.status(200).json(sala);
    } else {
      const salas = await salasServices.obtenerTodasLasSalas(
        limit,
        to,
        verDeshabilitadas
      );
      res.status(200).json(salas);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// POST
const crearUnaSala = async (req, res) => {
  try {
    const { errors } = validationResult(req);
    if (errors.length) {
      return res.status(422).json({ message: errors[0].msg });
    }

    const newSala = await salasServices.crearSala(req.body);
    res.status(201).json(newSala);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al crear la sala" });
  }
};
// PUT
const editarUnaSala = async (req, res) => {
  const { errors } = validationResult(req);
  if (errors.length) {
    return res.status(422).json({ message: errors[0].msg });
  }
  const idSala = req.params.idSala;
  console.log("ID del sala a editar:", idSala);
  try {
    const salaEditada = await salasServices.editarUnaSala(idSala, req.body);
    res.status(200).json(salaEditada);
  } catch (error) {
    console.log("Error en controlador:", error.message);
    res.status(500).json({ error: error.message });
  }
};
// DELETE
const borrarUnaSala = async (req, res) => {
  try {
    const id = req.params.idSala;
    const resultado = await salasServices.borrarUnaSala(id);
    res.status(200).json({ msg: "Sala borrada con exito", resultado });
  } catch (error) {
    res.status(500).json({ error: "Error al borrar la sala" });
  }
};

//HABILITAR
const habilitarSala = async (req, res) => {
  const result = await salasServices.habilitarSala(req.params.idSala);
  if (result.statusCode === 200) {
    res.status(200).json({ msg: result.msg });
  } else {
    res.status(500).json({ msg: result.msg });
  }
};

//DESHABILITAR
const deshabilitarUnaSala = async (req, res) => {
  const result = await salasServices.deshabilitarSala(req.params.idSala);
  if (result.statusCode === 200) {
    res.status(200).json({ msg: result.msg });
  } else {
    res.status(500).json({ msg: result.msg });
  }
};

//CLOUDINARY
const agregarImagenSalaPorId = async (req, res) => {
  try {
    const resultado = await salasServices.agregarImagen(
      req.params.idSala,
      req.file
    );
    if (resultado == 200) {
      return res.status(200).json({ msg: "Se agrego la imagen correctamente" });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  obtenerUnaSalaPorIdOTodos,
  crearUnaSala,
  editarUnaSala,
  borrarUnaSala,
  habilitarSala,
  deshabilitarUnaSala,
  agregarImagenSalaPorId,
};

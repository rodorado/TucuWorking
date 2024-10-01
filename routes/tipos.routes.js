const express = require('express');
const auth = require('../middlewares/auth');
const { obtenerUnTipoPorIdOTodos, crearUnTipo, editarUnTipo, borrarUnTipo } = require('../controllers/tipos.controllers');
const { tiposValidaciones } = require('../middlewares/validaciones');

const router = express.Router();

//GET
router.get("/:idTipo?", obtenerUnTipoPorIdOTodos);

//POST
router.post("/", tiposValidaciones, auth('admin'), crearUnTipo);

//PUT
router.put("/:idTipo", tiposValidaciones, auth('admin'), editarUnTipo);

//DELETE 
router.delete("/:idTipo", auth('admin'), borrarUnTipo);

module.exports = router;
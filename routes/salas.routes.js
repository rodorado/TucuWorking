const express = require("express");
const { obtenerUnaSalaPorIdOTodos, crearUnaSala, editarUnaSala, borrarUnaSala, habilitarSala,deshabilitarUnaSala } = require("../controllers/salas.controllers");
const { agregarSalaValidaciones} = require("../middlewares/validaciones");
const auth = require('../middlewares/auth')

const router = express.Router();

//GET
router.get("/:idSala?", obtenerUnaSalaPorIdOTodos);

//POST
router.post("/", agregarSalaValidaciones, auth('admin'), crearUnaSala);

//PUT
router.put("/:idSala", auth('admin'), agregarSalaValidaciones, editarUnaSala);

//DELETE
router.delete("/:idSala", auth('admin'), borrarUnaSala);

router.put('/habilitar/:idSala', auth('admin'), habilitarSala)
router.put('/deshabilitar/:idSala', auth('admin'), deshabilitarUnaSala)

module.exports = router;

const express = require("express");
const { obtenerUnaSalaPorIdOTodos, crearUnaSala, editarUnaSala, borrarUnaSala, habilitarSala,deshabilitarUnaSala } = require("../controllers/salas.controllers");
const { agregarSalaValidaciones } = require("../middlewares/validaciones");
const router = express.Router();

//GET
router.get("/:idSala?", obtenerUnaSalaPorIdOTodos);

//POST
router.post("/", agregarSalaValidaciones, crearUnaSala);

//PUT
router.put("/:idSala", agregarSalaValidaciones, editarUnaSala);

//DELETE
router.delete("/:idSala", borrarUnaSala);

router.put('/habilitar/:idSala', habilitarSala)
router.put('/deshabilitar/:idSala', deshabilitarUnaSala)

module.exports = router;

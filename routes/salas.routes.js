const express = require("express");
const { obtenerUnaSalaPorIdOTodos, crearUnaSala, editarUnaSala, borrarUnaSala, habilitarSala,deshabilitarUnaSala } = require("../controllers/salas.controllers");
const router = express.Router();

//GET
router.get("/:idSala?", obtenerUnaSalaPorIdOTodos);

//POST
router.post("/", crearUnaSala);

//PUT
router.put("/:idSala", editarUnaSala);

//DELETE
router.delete("/:idSala", borrarUnaSala);

router.put('/habilitar/:idSala', habilitarSala)
router.put('/deshabilitar/:idSala', deshabilitarUnaSala)

module.exports = router;

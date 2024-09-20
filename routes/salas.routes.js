const express = require("express");
const { obtenerUnaSalaPorIdOTodos, crearUnaSala, editarUnaSala, borrarUnaSala, disponibilidadDeUnaSala } = require("../controllers/salas.controllers");
const router = express.Router();

//GET
router.get("/:idSala?", obtenerUnaSalaPorIdOTodos);

//POST
router.post("/", crearUnaSala);

//PUT
router.put("/:idSala", editarUnaSala);

//DELETE
router.delete("/:idSala", borrarUnaSala);
router.put("/:idSala", disponibilidadDeUnaSala)

module.exports = router;

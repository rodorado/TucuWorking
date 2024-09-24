const express = require("express");
const { obtenerUnaSalaPorIdOTodos, crearUnaSala, editarUnaSala, borrarUnaSala, habilitarSala,deshabilitarUnaSala, agregarImagenSalaPorId } = require("../controllers/salas.controllers");
const { agregarSalaValidaciones } = require("../middlewares/validaciones");
const multer = require("../middlewares/multer");
const router = express.Router();

//GET
router.get("/:idSala?", obtenerUnaSalaPorIdOTodos);

//POST
router.post("/", agregarSalaValidaciones, crearUnaSala);
router.post('/agregarImagen/:idSala', multer.single('imagen'), agregarImagenSalaPorId) 

//PUT
router.put("/:idSala", agregarSalaValidaciones, editarUnaSala);

//DELETE
router.delete("/:idSala", borrarUnaSala);

router.put('/habilitar/:idSala', habilitarSala)
router.put('/deshabilitar/:idSala', deshabilitarUnaSala)

module.exports = router;

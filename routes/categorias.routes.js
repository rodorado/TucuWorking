const express = require('express');
const { obtenerUnaCategoriaPorIdOTodos, crearUnaCategoria, editarUnaCategoria, borrarUnaCategoria } = require('../controllers/categorias.controllers');
const { categoriasValidaciones } = require('../middlewares/validaciones');
const auth = require('../middlewares/auth')

const router = express.Router();



//GET
router.get("/:idCategoria?", obtenerUnaCategoriaPorIdOTodos);

//POST
router.post("/", categoriasValidaciones, auth('admin'), crearUnaCategoria);

//PUT
router.put("/:idCategoria", categoriasValidaciones, auth('admin'), editarUnaCategoria);

//DELETE 
router.delete("/:idCategoria", auth('admin'), borrarUnaCategoria);

module.exports = router;
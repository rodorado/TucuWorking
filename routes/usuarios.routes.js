const express = require("express")
const { registrarUsuario, obtenerTodosLosUsuarios, obtenerUsuario, bajaFisicaUsuario, bajaLogicaUsuario, editarUsuario } = require("../controllers/usuarios.controllers")
const router = express.Router()

//GET
router.get("/", obtenerTodosLosUsuarios)
router.get("/:idUsuario", obtenerUsuario)

//POST
router.post("/", registrarUsuario)

//PUT Editar
router.put("/:idUsuario", editarUsuario)

//Baja logica
router.put("/:idUsuario", bajaLogicaUsuario)

//Baja Fisica
router.delete("/:idUsuario", bajaFisicaUsuario)









module.exports = router
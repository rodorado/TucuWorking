const express = require("express")
const { registrarUsuario, obtenerTodosLosUsuarios, obtenerUsuario, bajaFisicaUsuario, bajaLogicaUsuario, editarUsuario, inciarSesionUsuario } = require("../controllers/usuarios.controllers")
const { registroValidaciones, loginValidaciones } = require("../middlewares/validaciones")
const router = express.Router()


//GET
router.get("/", obtenerTodosLosUsuarios)
router.get("/:idUsuario", obtenerUsuario)

//POST
router.post("/", registroValidaciones, registrarUsuario)
//LOGIN
router.post("/login", loginValidaciones, inciarSesionUsuario)
//PUT Editar
router.put("/:idUsuario", registroValidaciones, editarUsuario)

//Baja logica
router.put("/:idUsuario", bajaLogicaUsuario)

//Baja Fisica
router.delete("/:idUsuario", bajaFisicaUsuario)









module.exports = router
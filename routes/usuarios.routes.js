const express = require("express")
const { registrarUsuario, obtenerTodosLosUsuarios, obtenerUsuario, bajaFisicaUsuario, bajaLogicaUsuario, editarUsuario, inciarSesionUsuario } = require("../controllers/usuarios.controllers")
const { registroValidaciones, loginValidaciones } = require("../middlewares/validaciones")
const auth = require("../middlewares/auth")
const router = express.Router()


//GET
router.get("/", auth('admin'), obtenerTodosLosUsuarios)
router.get("/:idUsuario", auth('admin'), obtenerUsuario)

//POST
router.post("/", registroValidaciones, registrarUsuario)
//LOGIN
router.post("/login", loginValidaciones, inciarSesionUsuario)
//PUT Editar
router.put("/:idUsuario", registroValidaciones, editarUsuario)

//Baja logica
router.put("/:idUsuario/borradoLogico", bajaLogicaUsuario)

//Baja Fisica
router.delete("/:idUsuario", auth('admin'), bajaFisicaUsuario)









module.exports = router
const express = require("express");
const multer = require("../middlewares/multer");
const auth = require('../middlewares/auth');
const { crearUnaReserva, obtenerReservas, obtenerReserva, actualizarUnaReserva, eliminarUnaReserva, mercadoPago } = require("../controllers/reservas.controllers");
const { reservasValidaciones } = require('../middlewares/validaciones')
const router = express.Router();

//GET
router.get("/", auth("admin"), obtenerReservas)
//GET ONE
router.get("/:idReserva", obtenerReserva)
//POST
router.post("/crearPago", mercadoPago)
router.post("/", reservasValidaciones, crearUnaReserva);
//PUT
router.put("/:idReserva", auth("admin"), reservasValidaciones, actualizarUnaReserva)
//DELETE
router.delete("/:idReserva", auth("admin"), eliminarUnaReserva)


module.exports = router
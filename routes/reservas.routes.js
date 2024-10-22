const express = require("express");
const multer = require("../middlewares/multer");
const auth = require('../middlewares/auth');
const { crearUnaReserva, obtenerReservas, obtenerReserva, actualizarUnaReserva, eliminarUnaReserva, mercadoPago } = require("../controllers/reservas.controllers");
const { reservasValidaciones } = require('../middlewares/validaciones')
const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Reservas:
 *      type: object
 *      properties:
 *          idUsuario:
 *            type: string
 *            description: id unico del usuario
 *          idSala:
 *            type: string
 *            description: id unico de la sala.
 *            example: "60a5bcd8fc13ae1cf0000001"
 *          fecha:
 *            type: string
 *            format: date
 *            example: "2024-01-01"
 *          horaInicio:
 *             type: string
 *             example: "08:00"
 *          horaFin: 
 *             type: string
 *             example: "12:00"
 *          cantidadPersonas:
 *              type: number
 *          estado: 
 *              type: string
 *              enum:
 *                  - pendiente
 *                  - finalizado
 *                  - cancelado
 *              description: "Estado de la reserva"
 *              example: "pendiente" 
 *          precioTotal:
 *              type: number
 *              description: "precio total de la reserva"
 *              example: 15000.50
 *          createdAt:
 *              type: string
 *              format: date-time
 *              description: "Fecha y hora en que se creó la reserva"
 *              example: "2024-01-01T08:00:00Z"
 * 
 *      required:
 *          - idUsuario
 *          - idSala
 *          - fecha
 *          - horaInicio
 *          - horaFin
 *          - cantidadPersonas           
 */

//GET

/**
 * @swagger
 * /api/reservas:
 *  get:
 *      summary: Mostrar todas las reservas
 *      tags: [Reserva]
 *      responses: 
 *          200:
 *              description: Listado de reservas
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                           $ref: '#/components/schemas/Reservas'             
 */
router.get("/", auth("admin"), obtenerReservas)
//GET ONE
/**
 * @swagger
 * /api/reservas/{id}:
 *  get:
 *      summary: Muestra una reserva
 *      tags: [Reserva]
 *      parameters:
 *          - in: path
 *              name: id
 *              schema:
 *                  type: String
 *              require: true
 *              description: id unico
 *      responses: 
 *          200:
 *              description: Muestra una reserva por id
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          items:
 *                           $ref: '#/components/schemas/reservas'
 *          400:
 *              description: Error reserva no encontrada                
 */
router.get("/:idReserva", obtenerReserva)
//POST
/**
 * @swagger
 * /api/reservas:
 *  post:
 *      summary: crear una nueva reserva
 *      tags: [Reserva]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/Reservas'
 *      responses: 
 *          200:
 *              description: Reserva guardada con exito
 *                  
 */
router.post("/crearPago", mercadoPago)
router.post("/", reservasValidaciones, crearUnaReserva);
//PUT
/**
 * @swagger
 * /api/reservas/{id}:
 *  put:
 *      summary: Editar una reserva
 *      tags: [Reserva]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: String
 *            required: true  // Cambiado a required
 *            description: id único de la reserva
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Reservas' 
 *      responses: 
 *          200:
 *              description: Reserva modificada con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Reservas'  
 *          400:
 *              description: Error reserva no encontrada
 */
router.put("/:idReserva", auth("admin"), reservasValidaciones, actualizarUnaReserva)
//DELETE

/**
 * @swagger
 * /api/reservas/{id}:
 *  delete:
 *      summary: Elimina una reserva
 *      tags: [Reserva]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: String
 *            required: true  
 *            description: id único de la reserva
 *      responses: 
 *          200:
 *              description: Reserva eliminada con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/reservas'  
 *          400:
 *              description: Error reserva no encontrada
 */
router.delete("/:idReserva", auth("admin"), eliminarUnaReserva)


module.exports = router
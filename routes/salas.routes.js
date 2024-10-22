const express = require("express");
const multer = require("../middlewares/multer");
const { obtenerUnaSalaPorIdOTodos, crearUnaSala, editarUnaSala, borrarUnaSala, habilitarSala,deshabilitarUnaSala, agregarImagenSalaPorId } = require("../controllers/salas.controllers");
const { agregarSalaValidaciones} = require("../middlewares/validaciones");
const auth = require('../middlewares/auth')

const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Salas:
 *      type: object
 *      properties:
 *          nombre:
 *            type: string
 *            description: Nombre de sala creado automaticamente
 *          tipoDeSala:
 *            type: string
 *            description: puede ser premiun, economy o confort se pueden crear más, se debe enviar su id.
 *            example: "60a5bcd8fc13ae1cf0000001"
 *          categoriaDeSala:
 *            type: string
 *            description: Se debe enviar el id de la respectiva categoria.
 *            example: "60a5bcd8fc13ae1cf0000002"
 *          capacidad:
 *            type: number
 *            description: cuantas personas entran en la sala
 *          precio:
 *            type: number
 *            description: valor en pesos argentinos por hora
 *          imagen:
 *            type: string
 *            description: imagen ilustrativa de la sala
 *            example: "imagen-url.jpg"
 *          horariosDisponibles:
 *             type: array
 *             items:
 *              type: object 
 *              properties:
 *                  fecha:
 *                      type: string
 *                      format: date
 *                      example: "2024-01-01"
 *                  horaInicio:
 *                      type: string
 *                      example: "08:00"
 *                  horaFin: 
 *                      type: string
 *                      example: "12:00"
 *                  disponibilidad:
 *                      type: boolean
 *                      example: true
 *      required:
 *          - nombre
 *          - tipoDeSala
 *          - categoriaDeSala
 *          - capacidad
 *          - precio
 *          - fecha
 *          - horarioInicio
 *          - horarioFin
 *          - disponibilidad
 *             
 */

//GET

/**
 * @swagger
 * /api/salas/{id}:
 *  get:
 *      summary: Muestra una sala
 *      tags: [Salas]
 *      parameters:
 *          - in: path
 *              name: id
 *              schema:
 *                  type: String
 *              require: true
 *              description: id unico
 *      responses: 
 *          200:
 *              description: Muestra una sala por id
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          items:
 *                           $ref: '#/components/schemas/Salas'
 *          400:
 *              description: Error Sala no encontrada
 *      
 *                  
 */
router.get("/:idSala?", obtenerUnaSalaPorIdOTodos);

//POST

 /**
 * @swagger
 * /api/salas:
 *  post:
 *      summary: crear una nueva sala
 *      tags: [Sala]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/Salas'
 *      responses: 
 *          200:
 *              description: Sala guardada con exito
 *                  
 */
router.post("/", agregarSalaValidaciones, auth('admin'), crearUnaSala);
router.post('/agregarImagen/:idSala', multer.single('imagen'), agregarImagenSalaPorId) 


//PUT
/**
 * @swagger
 * /api/salas/{id}:
 *  put:
 *      summary: Editar una sala
 *      tags: [Sala]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: String
 *            required: true  // Cambiado a required
 *            description: id único de la sala
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Salas' 
 *      responses: 
 *          200:
 *              description: Sala modificada con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Salas'  
 *          400:
 *              description: Error sala no encontrada
 */
router.put("/:idSala", auth('admin'), agregarSalaValidaciones, editarUnaSala);

//DELETE

/**
 * @swagger
 * /api/salas/{id}:
 *  delete:
 *      summary: Elimina una sala
 *      tags: [Sala]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: String
 *            required: true  
 *            description: id único de la sala
 *      responses: 
 *          200:
 *              description: Sala eliminada con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Salas'  
 *          400:
 *              description: Error sala no encontrada
 */
router.delete("/:idSala", auth('admin'), borrarUnaSala);

router.put('/habilitar/:idSala', auth('admin'), habilitarSala)
router.put('/deshabilitar/:idSala', auth('admin'), deshabilitarUnaSala)

module.exports = router;

const express = require('express');
const auth = require('../middlewares/auth');
const { obtenerUnTipoPorIdOTodos, crearUnTipo, editarUnTipo, borrarUnTipo } = require('../controllers/tipos.controllers');
const { tiposValidaciones } = require('../middlewares/validaciones');

const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Tipos:
 *      type: object
 *      properties:
 *          nombre:
 *            type: string
 *            description: Nombre del tipo que maneja el negocio
 *          categoriasDisponibles:
 *            type: object
 *            description: id de las categorias disponibles
 *         
 *   
 *      required:
 *          - nombre
 *          - categoriasdisponibles
 *      example:
 *          nombre: premiun
 *          categoriasDisponibles: 645258985ff5
 *         
 *             
 */

//GET
/**
 * @swagger
 * /api/tipos/{id}:
 *  get:
 *      summary: Muestra un tipo
 *      tags: [Tipos]
 *      parameters:
 *          - in: path
 *              name: id
 *              schema:
 *                  type: String
 *              require: true
 *              description: id unico
 *      responses: 
 *          200:
 *              description: Muestra un tipo por id
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          items:
 *                           $ref: '#/components/schemas/Tipos'
 *          400:
 *              description: Error tipo no encontrado
 *      
 *                  
 */
router.get("/:idTipo?", obtenerUnTipoPorIdOTodos);

//POST
/**
 * @swagger
 * /api/tipos:
 *  post:
 *      summary: crear un nuevo tipo
 *      tags: [Tipo]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/Tipos'
 *      responses: 
 *          200:
 *              description: Tipo guardado con exito
 *                  
 */
router.post("/", tiposValidaciones, auth('admin'), crearUnTipo);

//PUT
/**
 * @swagger
 * /api/tipos/{id}:
 *  put:
 *      summary: Editar un tipo
 *      tags: [Tipo]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: String
 *            required: true  // Cambiado a required
 *            description: id único del tipo
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Tipos' 
 *      responses: 
 *          200:
 *              description: Tipo modificado con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Tipos'  
 *          400:
 *              description: Error tipo no encontrado
 */
router.put("/:idTipo", tiposValidaciones, auth('admin'), editarUnTipo);

//DELETE 
/**
 * @swagger
 * /api/tipos/{id}:
 *  delete:
 *      summary: Elimina un tipo
 *      tags: [Tipo]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: String
 *            required: true  
 *            description: id único del tipo
 *      responses: 
 *          200:
 *              description: Tipo eliminado con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Tipos'  
 *          400:
 *              description: Error tipo no encontrado
 */
router.delete("/:idTipo", auth('admin'), borrarUnTipo);

module.exports = router;
const express = require("express")
const { registrarUsuario, obtenerTodosLosUsuarios, obtenerUsuario, bajaFisicaUsuario, bajaLogicaUsuario, editarUsuario, inciarSesionUsuario, solicitarRecuContrasenia, restablecerContrasenia } = require("../controllers/usuarios.controllers")
const { registroValidaciones, loginValidaciones } = require("../middlewares/validaciones")
const auth = require("../middlewares/auth")
const router = express.Router()


/**
 * @swagger
 * components:
 *  schemas:
 *    Usuarios:
 *      type: object
 *      properties:
 *          nombreApellido:
 *            type: string
 *            description: Nombre y aplellido del usuario que aparece en su DNI
 *          contrasenia:
 *            type: String
 *            description: Contraseña alfanumerica, tiene un min:8 caracteres y un max:50 caracteres, no puede enviarse vacio
 *          email:
 *            type: String
 *            description: Debe responder el formato universal de correos electronicos como gmail, hotmail, ect.
 *          tokenRecuperacion:
 *            type:  String
 *            description: token generado con bcrypt, se utiliza cuando el usuario olvido su contraseña y quiere generar una nueva
 *          expiracionToken:
 *            type: Date
 *            description: es el tiempo de duracion que tiene el token de recuperacion de contraseña una vez culminado el token expira y se debe generar uno nuevo
 *          rol: 
 *            type: String
 *            description: el rol de usuario puede ser admin o usuario, cuando se crea un usuario por defecto se le asigna el rol usuario a menos que se especifique que es rol admin
 *          bloqueado:
 *            type: boolean
 *            description: si el usuario tiene este campo en true significa que esta baneado del sistema 
 *      required:
 *          - nombreApellido
 *          - email
 *          - contrasenia
 *      example:
 *          nombreApellido: Aixa Macarena Filsinger
 *          contrasenia: panchita102030
 *          email: aixa.filsinger@gmail.com
 *             
 */


//GET
/**
 * @swagger
 * /api/usuarios:
 *  get:
 *      summary: Mostrar todos los usuarios
 *      tags: [Usuario]
 *      responses: 
 *          200:
 *              description: Listado de usuarios
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                           $ref: '#/components/schemas/Usuarios'
 *      
 *                  
 */
router.get("/", auth('admin'), obtenerTodosLosUsuarios)
/**
 * @swagger
 * /api/usuarios/{id}:
 *  get:
 *      summary: Muestra un usuario
 *      tags: [Usuario]
 *      parameters:
 *          - in: path
 *              name: id
 *              schema:
 *                  type: String
 *              require: true
 *              description: id unico
 *      responses: 
 *          200:
 *              description: Muestra el usuario por id
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          items:
 *                           $ref: '#/components/schemas/Usuarios'
 *          400:
 *              description: Error usuario no encontrado
 *      
 *                  
 */
router.get("/:idUsuario", auth('admin'), obtenerUsuario)

//POST

/**
 * @swagger
 * /api/usuarios:
 *  post:
 *      summary: crear un nuevo usuario
 *      tags: [Usuario]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/Usuarios'
 *      responses: 
 *          200:
 *              description: Usuario registrado con exito
 *                  
 */
router.post("/", registroValidaciones, registrarUsuario)
//LOGIN
/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     summary: Realizar login para obtener token JWT
 *     tags: [Usuario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "usuario@ejemplo.com"
 *               contrasenia:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Token JWT devuelto con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Credenciales inválidas
 */
router.post("/login", loginValidaciones, inciarSesionUsuario)
//PUT Editar
/**
 * @swagger
 * /api/usuarios/{id}:
 *  put:
 *      summary: Edita un usuario
 *      tags: [Usuario]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: String
 *            required: true  // Cambiado a required
 *            description: id único del usuario
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Usuarios' 
 *      responses: 
 *          200:
 *              description: Usuario modificado con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Usuarios'  
 *          400:
 *              description: Error usuario no encontrado
 */

router.put("/:idUsuario", registroValidaciones,editarUsuario)

//Baja logica
router.put("/:idUsuario/borradoLogico", bajaLogicaUsuario)

//Baja Fisica
/**
 * @swagger
 * /api/usuarios/{id}:
 *  delete:
 *      summary: Elimina un usuario
 *      tags: [Usuario]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: String
 *            required: true  
 *            description: id único del usuario
 *      responses: 
 *          200:
 *              description: Usuario eliminado con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Usuarios'  
 *          400:
 *              description: Error usuario no encontrado
 */

router.delete("/:idUsuario", auth('admin'), bajaFisicaUsuario)

//Restablecer contraseña
router.post("/recuperar-contrasenia", solicitarRecuContrasenia)
router.post("/restablecer-contrasenia/:token", restablecerContrasenia)









module.exports = router
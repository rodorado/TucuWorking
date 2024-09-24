const { check } = require('express-validator')

const registroValidaciones = [
  check('nombreApellido', 'Campo vacio').not().isEmpty(),
  check('nombreApellido', 'min: 8 caracteres y max: 100').isLength({min:8, max: 100}),
  check('email', 'Campo EMAIL está vacío').not().isEmpty(),
  check('email', 'Formato incorrecto: Tiene que ser un email').isEmail(),
  check('contrasenia', 'Campo CONTRASEÑA esta vacio').not().isEmpty(),
  check('contrasenia', 'min: 8 caracteres y max: 50 caracteres').isLength({min:8, max: 50})
]

const loginValidaciones = [
    check('email', 'Campo EMAIL esta vacio').not().isEmpty(),
    check('contrasenia', 'Campo CONTRASEÑA esta vacio').not().isEmpty()
]

const agregarSalaValidaciones = [
    check('nombre', 'Campo vacio').not().isEmpty(),
    check('nombre', 'min: 5 caracteres y max: 10 ').isLength({min:5, max: 10}),
    check('tipo', 'Campo vacio').not().isEmpty(),
    check('capacidad', 'Campo vacio').not().isEmpty(),
    check('precio', 'Campo vacio').not().isEmpty()
]

const categoriasValidaciones = [
    check('nombre', 'Campo vacio').not().isEmpty(),
    check('nombre', 'min: 5 caracteres y max: 10 ').isLength({min:5, max: 10}),
]

module.exports = {
    registroValidaciones,
    loginValidaciones,
    agregarSalaValidaciones,
    categoriasValidaciones,
}


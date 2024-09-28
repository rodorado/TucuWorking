const { check, body } = require('express-validator')
const CategoriasModels = require('../models/categorias.schemas')

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
    check('tipoDeSala', 'Campo vacio').not().isEmpty(),
    check('categoriaDeSala', 'Campo vacio').not().isEmpty(),
    check('capacidad', 'Campo vacio').not().isEmpty(),
    check('precio', 'Campo vacio').not().isEmpty(),
    check('horariosDisponibles', 'Campo vacio').not().isEmpty(),
]

const categoriasValidaciones = [
    check('nombre', 'Campo vacio').not().isEmpty(),
    check('nombre', 'min: 5 caracteres y max: 10 ').isLength({min:5, max: 10}),
]

const tiposValidaciones = [
    check('nombre', 'Campo vacio').not().isEmpty(),
    check('categoriasDisponibles', 'Campo vacio').not().isEmpty(),
    body('categoriasDisponibles').custom(async (categoriasNombres) => {
        // Verifica que cada categoría sea un string
        if (!Array.isArray(categoriasNombres) || !categoriasNombres.every(categoria => typeof categoria === 'string')) {
            throw new Error('Las categorías deben ser un arreglo de strings');
        }

        // Buscar las categorías por nombre en la base de datos
        const categorias = await CategoriasModels.find({ nombre: { $in: categoriasNombres } });

        // Comprobar si no se encontró ninguna categoría válida
        if (categorias.length === 0) {
            throw new Error('Ninguna categoría es válida');
        }

        // Filtrar las categorías no válidas (opcional, dependiendo de cómo manejes las categorías válidas en tu modelo)
        const categoriasValidas = ['economy', 'confort', 'premium'];
        const categoriasNoValidas = categoriasNombres.filter(
            (nombre) => !categoriasValidas.includes(nombre)
        );

        // Comprobar si hay categorías no válidas en comparación con las categorías permitidas
        if (categoriasNoValidas.length > 0) {
            throw new Error(`Las categorías deben ser una de las siguientes: ${categoriasValidas.join(', ')}`);
        }

        return true;
    }),
];



module.exports = {
    registroValidaciones,
    loginValidaciones,
    agregarSalaValidaciones,
    categoriasValidaciones,
    tiposValidaciones
}


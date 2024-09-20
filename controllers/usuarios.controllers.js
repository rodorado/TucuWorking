const usuariosServices = require("../services/usuarios.services");

//GET TODOS LOS USUARIOS
const obtenerTodosLosUsuarios = (req, res) => {
  try {
    const users = usuariosServices.traerTodosLosUsuarios();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
};

//GET UN SOLO USUARIO
const obtenerUsuario = (req, res) => {
  try {
    const id = req.params.idUsuario;
    const usuario = usuariosServices.traerUnUsuario(id);
    if (!usuario) return res.status(400).json({ msg: "Usuario no encontrado" });
    res.status(200).json({ msg: "Usuario encontrado", usuario });
  } catch (error) {
    console.log(error);
  }
};

//POST
const registrarUsuario = (req, res) => {
  try {
    const nuevoUsuario = usuariosServices.añadirUnUsuario(req.body);
    if (nuevoUsuario.error) {
      return res.status(400).json({ msg: nuevoUsuario.msg });
    }
    res
      .status(200)
      .json({ msg: nuevoUsuario.msg, usuario: nuevoUsuario.usuario });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor", error });
  }
};

//PUT EDITAR USUARIO
const editarUsuario = (req, res) => {
  try {
    const id = req.params.idUsuario;
    const data = req.body;

    const resultado = usuariosServices.modificarUsuario(id, data);
    if (resultado.error) {
      return res.status(400).json({ mensaje: resultado.msg });
    }
    res.status(200).json(resultado.usuario);
  } catch (error) {
    res.status(500).json({ msg: "Error al editar usuario", error });
  }
};

//DELETE fisico
const bajaFisicaUsuario = (req, res) => {
  try {
    const id = req.params.idUsuario;
    const borrado = usuariosServices.borradoFisicoUsuario(id);
    res.status(200).json({ msg: "Usuario borrado con éxito", borrado });
  } catch (error) {
    console.log(error);
  }
};

//DELETE logico
const bajaLogicaUsuario = (req, res) => {
  try {
    const id = req.params.idUsuario;
    const borradoLogico = usuariosServices.borradoLogicoUsuario(id);
    res.status(200).json({ msg: borradoLogico });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  registrarUsuario,
  obtenerTodosLosUsuarios,
  obtenerUsuario,
  bajaFisicaUsuario,
  bajaLogicaUsuario,
  editarUsuario,
};

const { token } = require("morgan");
const usuariosServices = require("../services/usuarios.services");
const { validationResult } = require('express-validator')


//GET TODOS LOS USUARIOS
const obtenerTodosLosUsuarios = async(req, res) => {
  try {
    const limit = req.query.limit || 10;
    const to = req.query.to || 0;
    const verBloqueados = req.query.verBloqueados === 'true';
    const users = await usuariosServices.traerTodosLosUsuarios(limit, to, verBloqueados);
    res.status(200).json(users);

  } catch (error) {
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
};

//GET UN SOLO USUARIO
const obtenerUsuario = async (req, res) => {
  try {
    const id = req.params.idUsuario;
    const usuario = await usuariosServices.traerUnUsuario(id);
    if (!usuario) return res.status(400).json({ msg: "Usuario no encontrado" });
    res.status(200).json({ msg: "Usuario encontrado", usuario });
  } catch (error) {
    console.log(error);
  }
};

//POST
const registrarUsuario = async (req, res) => {
  try {
    const { errors } = validationResult(req);
  
    if (errors.length) {
      return res.status(422).json({ message: errors[0].msg });
    }

    const nuevoUsuario = await usuariosServices.añadirUnUsuario(req.body);
    
    if (nuevoUsuario.error) {
      return res.status(400).json({ msg: nuevoUsuario.msg });
    } else if (nuevoUsuario === 409) {
      return res.status(409).json({ msg: 'Error al crear: Rol incorrecto. Solo se puede ser usuario o admin' });
    }

    return res.status(200).json({ msg: nuevoUsuario.msg, usuario: nuevoUsuario.usuario });
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error en el servidor", error });
  }
};


//Login
const inciarSesionUsuario = async (req, res) => {
  try {
    const { errors } = validationResult(req)
  
    if (errors.length) {
      return res.status(422).json({ message: errors[0].msg })
    }

    const result = await usuariosServices.inicioSesion(req.body);

    if (result.code === 400) {
      res.status(400).json({ msg: result.msg });
    } else if (result.code === 200) {
      res.status(200).json({ msg: result.msg, token: result.token });
    } else {
      res.status(500).json({ msg: result.msg });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor", error });
  }
};

//PUT EDITAR USUARIO
const editarUsuario = async (req, res) => {
  try {
    const { errors } = validationResult(req);
  
    if (errors.length) {
      return res.status(422).json({ message: errors[0].msg });
    }

    const id = req.params.idUsuario;
    const data = req.body;

    if (data.rol && data.rol !== 'usuario' && data.rol !== 'admin') {
      return res.status(400).json({ msg: 'Error: Rol incorrecto. Solo se puede ser usuario o admin.' });
    }

    const resultado = await usuariosServices.modificarUsuario(id, data);
    if (resultado.error) {
      return res.status(400).json({ msg: resultado.msg });
    }
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ msg: "Error al editar usuario", error });
  }
};

//DELETE fisico
const bajaFisicaUsuario = async(req, res) => {
  try {
    const id = req.params.idUsuario;
    const borrado = await usuariosServices.borradoFisicoUsuario(id);
    res.status(200).json({ msg: "Usuario borrado con éxito", borrado });
  } catch (error) {
    console.log(error);
  }
};

//DELETE logico
const bajaLogicaUsuario = async(req, res) => { 
  try {
    const usuario = await usuariosServices.borradoLogicoUsuario(req.params.idUsuario);
    res.status(200).json({ usuario });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al dar de baja al usuario' });
  }
};

//RECUPERACIÓN DE CONTRASEÑA
const solicitarRecuContrasenia = async (req, res) => {
  const { email } = req.body;
  const resultado = await usuariosServices.solicitarRecuperacionContrasenia(email);
  res.status(resultado.error ? 400 : 200).send(resultado); 
};

const restablecerContrasenia = async (req, res) => {
  const { token } = req.params;
  const { nuevaContrasenia } = req.body;
  const resultado = await usuariosServices.restablecerContrasenia(token, nuevaContrasenia);
  res.status(resultado.error ? 400 : 200).send(resultado);
};

module.exports = {
  registrarUsuario,
  obtenerTodosLosUsuarios,
  obtenerUsuario,
  bajaFisicaUsuario,
  bajaLogicaUsuario,
  editarUsuario,
  inciarSesionUsuario,
  solicitarRecuContrasenia, 
  restablecerContrasenia
};
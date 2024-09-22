const crypto = require("crypto");
const usuarioModel = require("../models/usuarios.schemas");
const bcrypt = require("bcrypt")

const traerTodosLosUsuarios = async() => {
  try {
    const obtenerUsers = await usuarioModel.find()
    return obtenerUsers
  } catch (error) {
    console.log(error);
  }
};

const traerUnUsuario = async(id) => {
  try {
    const usuario = await usuarioModel.findOne({_id: id})
    return usuario;
  } catch (error) {
    console.log(error);
  }
};
const añadirUnUsuario = async (body) => {
  try {
   
    const usuarioExiste = await usuarioModel.findOne({ email: body.email })

    if (usuarioExiste) {
      return { error: true, msg: "Error al registrar usuario", detalle: error };
    }

    let salt = bcrypt.genSaltSync();
    body.contrasenia = bcrypt.hashSync(body.contrasenia, salt);
  
    const user = new usuarioModel(body); 
    await user.save();  
    return { error: false, msg: "Usuario registrado con éxito", usuario: user }; 
  } catch (error) {
    return { error: true, msg: "Error al registrar usuario", detalle: error };
  }
};

const inicioSesion = async (body) => {
  try {
    
    const usuarioExiste = await usuarioModel.findOne({ email: body.email });

    if (!usuarioExiste) {
      return { code: 400, msg: "Email incorrecto" };
    }

    const verificacionContrasenia = bcrypt.compareSync(body.contrasenia, usuarioExiste.contrasenia);

    if (verificacionContrasenia) {
      return { code: 200, msg: "Inicio de sesión exitoso", usuario: usuarioExiste };
    } else {
      return { code: 400, msg: "Contraseña incorrecta" };
    }
  } catch (error) {
    console.log(error);
    return { code: 500, msg: "Error en el servidor", error: error.message };
  }
};


const modificarUsuario = async (idUsuario, data) => {
  try {
    const usuario = await usuarioModel.findByIdAndUpdate({_id: idUsuario}, data, {new: true});
    return usuario
  } catch (error) {
    console.log(error);
    return { error: true, msg: "Error al actualizar usuario", detalle: error.message };
  }
};


const borradoFisicoUsuario = async(idUsuario) => {
  try {
    await usuarioModel.findByIdAndDelete({_id: idUsuario})
    return 200
  } catch (error) {
    console.log(error);
  }
};

const borradoLogicoUsuario = async(idUsuario) => {
  try {
    const usuario = await usuarioModel.findOne({ _id: idUsuario })
    usuario.bloqueado = !usuario.bloqueado
  
    const actualizarUsuario = await usuarioModel.findByIdAndUpdate({ _id: idUsuario }, usuario, { new: true })
    return actualizarUsuario
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  traerTodosLosUsuarios,
  traerUnUsuario,
  añadirUnUsuario,
  borradoFisicoUsuario,
  borradoLogicoUsuario,
  modificarUsuario,
  inicioSesion,
};

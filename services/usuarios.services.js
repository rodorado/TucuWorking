const crypto = require("crypto");
const usuarioModel = require("../models/usuarios.schemas");


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
    const user = new usuarioModel(body);  // Creas una nueva instancia del usuario
    await user.save();  // Guardas el usuario en la base de datos
    return { error: false, msg: "Usuario registrado con éxito", usuario: user };  // Devuelves el usuario guardado
  } catch (error) {
    return { error: true, msg: "Error al registrar usuario", detalle: error };
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

const borradoLogicoUsuario = async (idUsuario) => {
  try {
    const usuario = await usuarioModel.findOne({ _id: idUsuario });

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    usuario.bloqueado = !usuario.bloqueado; // Cambia el estado de bloqueado
    const actualizarUsuario = await usuario.save(); // Guarda el usuario modificado

    return actualizarUsuario;
  } catch (error) {
    console.log(error);
    throw new Error('Error al realizar el borrado lógico');
  }
};


module.exports = {
  traerTodosLosUsuarios,
  traerUnUsuario,
  añadirUnUsuario,
  borradoFisicoUsuario,
  borradoLogicoUsuario,
  modificarUsuario,
};

const usuarioModel = require("../models/usuarios.schemas");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const { registroUsuario } = require("../helpers/mensajes");

const traerTodosLosUsuarios = async(limit, to, verBloqueados) => {
  try {
    /*const obtenerUsers = await usuarioModel.find()
    return obtenerUsers*/
    try {
      const query = verBloqueados ? {} : { bloqueado: true }; // Si se quiere ver bloqueados, no se aplica el filtro
  
      const [usuarios, cantidadTotal] = await Promise.all([
        usuarioModel.find(query).skip(to * limit).limit(limit),
        usuarioModel.countDocuments(verBloqueados ? {} : { bloqueado: true })
      ]);
  
      const paginacion = {
        usuarios,
        cantidadTotal
      };
      return paginacion;

    } catch (error) {
      console.log(error);
    }

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
    const usuarioExiste = await usuarioModel.findOne({ email: body.email });

    if (usuarioExiste) {
      return { error: true, msg: "Error al registrar usuario", detalle: error };
    }

    if (!body.rol) {
      body.rol = 'usuario';
    }

    if (body.rol !== 'usuario' && body.rol !== 'admin') {
      return 409;
    }

    let salt = bcrypt.genSaltSync();
    body.contrasenia = bcrypt.hashSync(body.contrasenia, salt);
  
    const user = new usuarioModel(body); 
    
    await user.save();  
    registroUsuario(body.email)
    return { error: false, msg: "Usuario registrado con éxito", usuario: user }; 
  } catch (error) {console.log(error)
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
      const payload = {
        _id: usuarioExiste._id,
        rol: usuarioExiste.rol,
        bloqueado: usuarioExiste.bloqueado,
      }

      const token = jwt.sign(payload, process.env.JWT_SECRET)

      return { code: 200, token, msg: "Inicio de sesión exitoso", usuario: usuarioExiste };
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
    const usuario = await usuarioModel.findById(idUsuario);

    if (!usuario) {
      return { error: true, msg: 'Usuario no encontrado' };
    }

    // Verifica si el rol es "usuario" y no permite cambiar a "admin"
    if (usuario.rol === 'usuario' && data.rol === 'admin') {
      return { error: true, msg: "Un usuario no puede cambiar su rol a admin." };
    }

    // Eliminar el campo "bloqueado" si existe en la data
    delete data.bloqueado;

    // Encriptar la nueva contraseña si está presente
    if (data.contrasenia) {
      const salt = await bcrypt.genSalt(10);
      data.contrasenia = await bcrypt.hash(data.contrasenia, salt);
    }

    // Actualizar el usuario
    const usuarioActualizado = await usuarioModel.findByIdAndUpdate(idUsuario, data, { new: true });
    return { error: false, usuario: usuarioActualizado };
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
  inicioSesion,
};

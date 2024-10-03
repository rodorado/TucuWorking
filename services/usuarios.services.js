const usuarioModel = require("../models/usuarios.schemas");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { registroUsuario, msgRecuContrasenia } = require("../helpers/mensajes");

const traerTodosLosUsuarios = async (
  limit = 10,
  to = 0,
  verBloqueados = false
) => {
  try {
    const query = verBloqueados ? {} : { bloqueado: false };
    const skipValue = to >= 0 ? to * limit : 0;

    const [usuarios, cantidadTotal] = await Promise.all([
      usuarioModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skipValue)
        .limit(limit),
      usuarioModel.countDocuments(query),
    ]);

    const paginacion = {
      usuarios,
      cantidadTotal,
      paginaActual: to + 1,
      paginasTotales: Math.ceil(cantidadTotal / limit),
    };

    return paginacion;
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener los usuarios");
  }
};

const traerUnUsuario = async (id) => {
  try {
    const usuario = await usuarioModel.findOne({ _id: id });
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
      body.rol = "usuario";
    }

    if (body.rol !== "usuario" && body.rol !== "admin") {
      return 409;
    }

    let salt = bcrypt.genSaltSync();
    body.contrasenia = bcrypt.hashSync(body.contrasenia, salt);

    const user = new usuarioModel(body);

    await user.save();
    registroUsuario(body.email);
    return { error: false, msg: "Usuario registrado con éxito", usuario: user };
  } catch (error) {
    console.log(error);
    return { error: true, msg: "Error al registrar usuario", detalle: error };
  }
};

const inicioSesion = async (body) => {
  try {
    const usuarioExiste = await usuarioModel.findOne({ email: body.email });

    if (!usuarioExiste) {
      return { code: 400, msg: "Email incorrecto" };
    }

    const verificacionContrasenia = bcrypt.compareSync(
      body.contrasenia,
      usuarioExiste.contrasenia
    );

    if (verificacionContrasenia) {
      const payload = {
        _id: usuarioExiste._id,
        rol: usuarioExiste.rol,
        bloqueado: usuarioExiste.bloqueado,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET);

      return {
        code: 200,
        token,
        msg: "Inicio de sesión exitoso",
        usuario: usuarioExiste,
      };
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
      return { error: true, msg: "Usuario no encontrado" };
    }

    if (usuario.rol === "usuario" && data.rol === "admin") {
      return {
        error: true,
        msg: "Un usuario no puede cambiar su rol a admin.",
      };
    }

    delete data.bloqueado;

    if (data.contrasenia) {
      const salt = await bcrypt.genSalt(10);
      data.contrasenia = await bcrypt.hash(data.contrasenia, salt);
    }

    const usuarioActualizado = await usuarioModel.findByIdAndUpdate(
      idUsuario,
      data,
      { new: true }
    );
    return { error: false, usuario: usuarioActualizado };
  } catch (error) {
    console.log(error);
    return {
      error: true,
      msg: "Error al actualizar usuario",
      detalle: error.message,
    };
  }
};

const borradoFisicoUsuario = async (idUsuario) => {
  try {
    await usuarioModel.findByIdAndDelete({ _id: idUsuario });
    return 200;
  } catch (error) {
    console.log(error);
  }
};

const borradoLogicoUsuario = async (idUsuario) => {
  try {
    const usuario = await usuarioModel.findOne({ _id: idUsuario });

    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    usuario.bloqueado = !usuario.bloqueado; 
    const actualizarUsuario = await usuario.save(); 

    return actualizarUsuario;
  } catch (error) {
    console.log(error);
    throw new Error("Error al realizar el borrado lógico");
  }
};

// Ruta para solicitar recuperación de contraseña
const solicitarRecuperacionContrasenia = async (email) => {
  try {
    console.log("email recibido: ", email);
    const usuario = await usuarioModel.findOne({ email });

    if (!usuario) {
      return { error: true, msg: "El email no está registrado" };
    }
    const token = crypto.randomBytes(32).toString("hex");
    usuario.tokenRecuperacion = token;
    usuario.expiracionToken = Date.now() + 3600000; 
    await usuario.save();
    msgRecuContrasenia(email , token);
    return { error: false, msg: "Correo de recuperación enviado" };
  } catch (error) {
    console.log(error);
    return { error: true, msg: "Error al enviar correo de recuperación" };
  }
};
const restablecerContrasenia = async (token, nuevaContrasenia) => {
  try {
    const usuario = await usuarioModel.findOne({
      tokenRecuperacion: token,
      expiracionToken: { $gt: Date.now() }, 
    });

    if (!usuario) {
      return { error: true, msg: "Token inválido o expirado" };
    }

    const salt = await bcrypt.genSalt(10);
    usuario.contrasenia = await bcrypt.hash(nuevaContrasenia, salt);

    usuario.tokenRecuperacion = undefined;
    usuario.expiracionToken = undefined;

    await usuario.save();

    return { error: false, msg: "Contraseña restablecida correctamente" };
  } catch (error) {
    console.log(error);
    return { error: true, msg: "Error al restablecer la contraseña" };
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
  solicitarRecuperacionContrasenia,
  restablecerContrasenia,
};

const crypto = require("crypto");

const usuarios = [
  {
    id: 1,
    userUsuario: "rodorado",
    nombreApellido: "Rocio Dorado",
    emailUsuario: "rocio_dorado12@hotmail.com",
    contrasenia: "458965327",
    baja: false,
  },
];

const traerTodosLosUsuarios = () => {
  try {
    return usuarios;
  } catch (error) {
    console.log(error);
  }
};

const traerUnUsuario = (id) => {
  try {
    const usuario = usuarios.find((user) => user.id === id);
    return usuario;
  } catch (error) {
    console.log(error);
  }
};
const añadirUnUsuario = (body) => {
  try {
    const emailExiste = usuarios.find(
      (usuario) => usuario.emailUsuario === body.emailUsuario
    );
    const usuarioExiste = usuarios.find(
      (usuario) => usuario.userUsuario === body.userUsuario
    );

    if (emailExiste) {
      return { error: true, msg: "Email no disponible" };
    }

    if (usuarioExiste) {
      return { error: true, msg: "Usuario no disponible" };
    }
    const id = crypto.randomUUID();
    const nuevoUsuario = { id, baja: false, ...body };
    usuarios.push(nuevoUsuario);
    return {
      error: false,
      msg: "Usuario registrado con éxito",
      usuario: nuevoUsuario,
    };
  } catch (error) {
    return { error: true, msg: "Error al registrar usuario", detalle: error };
  }
};

const modificarUsuario = (idUsuario, data) => {
  try {
    const posicionUsuario = usuarios.findIndex(
      (usuario) => usuario.id === idUsuario
    );

    // Si el usuario no existe
    if (posicionUsuario === -1) {
      return { error: true, msg: "Usuario no encontrado" };
    }

    // Validar si el email ya existe en otro usuario
    const emailExiste = usuarios.some(
      (usuario) =>
        usuario.emailUsuario === data.emailUsuario && usuario.id !== idUsuario
    );

    if (emailExiste) {
      return { error: true, msg: "Email ya está en uso" };
    }

    // Bloquear la edición de 'id' y 'baja'
    const camposEditables = { ...data };
    delete camposEditables.id;
    delete camposEditables.baja;

    // Actualizar el usuario
    const usuarioEditado = {
      ...usuarios[posicionUsuario],
      ...camposEditables,
    };

    usuarios[posicionUsuario] = usuarioEditado;

    return { error: false, usuario: usuarioEditado };
  } catch (error) {
    console.log(error);
  }
};

const borradoFisicoUsuario = (idUsuario) => {
  try {
    const posicionUsuario = usuarios.findIndex(
      (usuario) => usuario.idUsuario === idUsuario
    );
    usuarios.splice(posicionUsuario, 1);
    return 200;
  } catch (error) {
    console.log(error);
  }
};

const borradoLogicoUsuario = (idUsuario) => {
  try {
    const posicionUsuario = usuarios.findIndex(
      (usuario) => usuario.id === idUsuario
    );
    usuarios[posicionUsuario].baja = !usuarios[posicionUsuario].baja;
    const mensaje = usuarios[posicionUsuario].baja
      ? "Usuario dado de baja"
      : "Usuario dado de alta";
    return mensaje;
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
};

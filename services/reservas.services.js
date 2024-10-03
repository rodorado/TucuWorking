const ReservasModel = require("../models/reservas.schemas"); 
const SalasModel = require("../models/salas.schemas"); 
const TipoModel = require("../models/tipos.schemas");
const CategoriaModel = require("../models/categorias.schemas");
const {MercadoPagoConfig, Preference} = require('mercadopago');
const usuarioModel = require("../models/usuarios.schemas");

//GET
const obtenerTodasLasReservas = async () => {
  try {
    const traerReservas = await ReservasModel.find();
    return traerReservas;
  } catch (error) {
    console.log(error)
  }
}
//GET ONE
const obtenerUnaReserva = async (id) => {
  try {
    const reserva = await ReservasModel.findOne({ _id: id });
    return reserva || null; 
  } catch (error) {
    console.log(error)
    throw new Error('Error al buscar el tipo'); 
  }
}
//POST
const crearReserva = async (
  usuarioId,
  tipoDeSalaNombre,
  categoriaDeSalaNombre,
  fecha,
  horarioInicio,
  horarioFin,
  cantidadPersonas
) => {
  const usuario = await usuarioModel.findById(usuarioId);
  
  if (!usuario) {
    throw new Error("Usuario no encontrado");
  }

  const emailUsuario = usuario.email; 
  try {
    const fechaReserva = new Date(fecha);
    console.log(`Fecha de reserva: ${fechaReserva}`);
    if (isNaN(fechaReserva.getTime())) {
      throw new Error("Fecha inválida.");
    }

    const tipoDeSala = await TipoModel.findOne({ nombre: tipoDeSalaNombre });
    const categoriaDeSala = await CategoriaModel.findOne({
      nombre: categoriaDeSalaNombre,
    });

    console.log(`Tipo de sala: ${tipoDeSala}`);
    console.log(`Categoría de sala: ${categoriaDeSala}`);

    if (!tipoDeSala || !categoriaDeSala) {
      throw new Error("Tipo de sala o categoría de sala no encontrados.");
    }

    const reservasExistentes = await ReservasModel.find({
      idSala: tipoDeSala._id,
      fecha: fechaReserva,
      horarioInicio: { $lt: horarioFin },
      horarioFin: { $gt: horarioInicio },
    });

    const totalReservas = reservasExistentes.reduce(
      (total, reserva) => total + reserva.cantidadPersonas,
      0
    );

    console.log(`Total reservas existentes: ${totalReservas}`);

    let salaDisponible = await SalasModel.findOne({
      tipoDeSala: tipoDeSala._id,
      categoriaDeSala: categoriaDeSala._id,
      capacidad: { $gte: cantidadPersonas },
      disponibilidad: true,
    });

    console.log(`Sala disponible: ${salaDisponible}`);

    if (!salaDisponible) {
      throw new Error("No hay salas disponibles para la fecha y horario seleccionados");
    }

    // Si la sala no tiene capacidad suficiente, buscar otra sala
    if (totalReservas + cantidadPersonas > salaDisponible.capacidad) {
      const otraSala = await SalasModel.findOne({
        tipoDeSala: tipoDeSala._id,
        categoriaDeSala: categoriaDeSala._id,
        capacidad: { $gte: cantidadPersonas },
        disponibilidad: true,
      });

      console.log(`Otra sala disponible: ${otraSala}`);

      if (!otraSala) {
        throw new Error("Sala llena. No se encontró otra sala disponible con las mismas características.");
      } else {
        return await procesarReserva(usuarioId, otraSala, fechaReserva, horarioInicio, horarioFin, cantidadPersonas, emailUsuario);
      }
    }

    return await procesarReserva(usuarioId, salaDisponible, fechaReserva, horarioInicio, horarioFin, cantidadPersonas, emailUsuario);

  } catch (error) {
    throw new Error(error.message);
  }
};

// Función para procesar la reserva y el pago
const procesarReserva = async (usuarioId, sala, fechaReserva, horarioInicio, horarioFin, cantidadPersonas, emailUsuario) => {
  // Validar horario de inicio y fin para evitar NaN
  const horaInicio = new Date(`1970-01-01T${horarioInicio}:00Z`);
  const horaFin = new Date(`1970-01-01T${horarioFin}:00Z`);

  if (horaFin <= horaInicio) {
    throw new Error("El horario de fin debe ser mayor al horario de inicio.");
  }

  const duracionEnHoras = (horaFin - horaInicio) / (1000 * 60 * 60);
  const precioTotal = sala.precio * duracionEnHoras;

  const nuevaReserva = new ReservasModel({
    idUsuario: usuarioId,
    idSala: sala._id,
    nombreSala: sala.nombre,
    fecha: fechaReserva,
    horarioInicio,
    horarioFin,
    cantidadPersonas,
    precioTotal,
  });

  await nuevaReserva.save();
  console.log("Reserva creada:", nuevaReserva);

  // Iniciar el proceso de pago con Mercado Pago
  const paymentResult = await pagoConMP({
    items: [{
      title: sala.nombre,
      quantity: 1,
      unit_price: precioTotal,
    }],
    successUrl: 'http://localhost:front/success',  
    failureUrl: 'http://localhost:front/failure',
    pendingUrl: 'http://localhost:front/pending',
  });

  // Retornar la reserva y la URL de pago
  return { reserva: nuevaReserva, paymentUrl: paymentResult.result.init_point, emailUsuario };
};

//PUT
 const actualizarReserva = async (body, idReserva) => {
  try {
    await ReservasModel.findByIdAndUpdate({ _id: idReserva }, body);
    const reserva = await ReservasModel.find();
    return {
      msg: "Reserva actualizada",
      reserva,
      statusCode: 200,
    };
  } catch (error) {
    console.log(error)
  }
 }
//DELETE
const borrarReserva = async (idReserva) => {
  try {
    await ReservasModel.findByIdAndDelete({ _id: idReserva });
    return {
      msg: "Reserva eliminada",
      statusCode: 200,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const pagoConMP = async(body) =>{
 const cliente = new MercadoPagoConfig({accessToken: process.env.MP_ACCESS_TOKEN})
 const preference = new Preference(cliente)
 const { items, successUrl, failureUrl, pendingUrl } = body

 const result = await preference.create({
  body:{
    items: items,
    back_urls:{
      success: successUrl || 'http://localhost:front',  
        failure: failureUrl || 'http://localhost:front',
        pending: pendingUrl || 'http://localhost:'
    },
    auto_return: 'approved'
  }
 })
 return {
  result, statusCode:200
 }
}


module.exports = {
  crearReserva,
  obtenerTodasLasReservas,
  obtenerUnaReserva,
  actualizarReserva,
  borrarReserva,
  pagoConMP
};

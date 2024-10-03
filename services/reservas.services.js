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
      throw new Error(
        "No hay salas disponibles para la fecha y horario seleccionados"
      );
    }

    if (totalReservas + cantidadPersonas > salaDisponible.capacidad) {
      const otraSala = await SalasModel.findOne({
        tipoDeSala: tipoDeSala._id,
        categoriaDeSala: categoriaDeSala._id,
        capacidad: { $gte: cantidadPersonas },
        disponibilidad: true,
      });

      console.log(`Otra sala disponible: ${otraSala}`);

      if (!otraSala) {
        throw new Error(
          "Sala llena. No se encontró otra sala disponible con las mismas características."
        );
      } else {
        // Validar horario de inicio y fin para evitar NaN
        const horaInicio = new Date(`1970-01-01T${horarioInicio}:00Z`);
        const horaFin = new Date(`1970-01-01T${horarioFin}:00Z`);

        console.log(`Hora inicio: ${horaInicio}, Hora fin: ${horaFin}`);

        // Validar si la hora es válida antes de calcular
        if (isNaN(horaInicio.getTime()) || isNaN(horaFin.getTime())) {
          throw new Error("Horario de inicio o fin inválido.");
        }

        const duracionEnHoras = (horaFin - horaInicio) / (1000 * 60 * 60);
        console.log(`Duración en horas: ${duracionEnHoras}`);

        // Validar si precioPorHora es válido
        if (typeof otraSala.precio !== 'number' || isNaN(duracionEnHoras)) {
          throw new Error("Error al calcular el precio total.");
        }

        const precioTotal = otraSala.precio * duracionEnHoras;
        console.log(`Precio total: ${precioTotal}`);

        const nuevaReserva = new ReservasModel({
          idUsuario: usuarioId,
          idSala: otraSala._id,
          nombreSala: otraSala.nombre,
          fecha: fechaReserva,
          horarioInicio,
          horarioFin,
          cantidadPersonas,
          precioTotal,
        });

        await nuevaReserva.save();
        return { reserva: nuevaReserva, nombreSala: otraSala.nombre, precioTotal, emailUsuario };
      }
    }

    // Calcular la duración en horas
    const [horaInicio, minutoInicio] = horarioInicio.split(":").map(Number);
    const [horaFin, minutoFin] = horarioFin.split(":").map(Number);

    // Validar los horarios
    if (
      isNaN(horaInicio) || isNaN(minutoInicio) ||
      isNaN(horaFin) || isNaN(minutoFin)
    ) {
      throw new Error("Horario de inicio o fin inválido.");
    }

    const inicio = new Date(fechaReserva);
    inicio.setHours(horaInicio, minutoInicio, 0, 0);

    const fin = new Date(fechaReserva);
    fin.setHours(horaFin, minutoFin, 0, 0);

    console.log(`Inicio: ${inicio}, Fin: ${fin}`);

    if (fin <= inicio) {
      throw new Error("El horario de fin debe ser mayor al horario de inicio.");
    }

    const duracionEnHoras = (fin - inicio) / (1000 * 60 * 60);
    console.log(`Duración en horas: ${duracionEnHoras}`);

    // Validar si precioPorHora es válido
    const precio = salaDisponible.precio;
    console.log(`Precio por hora: ${precio}`);

    if (typeof precio !== 'number' || isNaN(precio)) {
      throw new Error("Precio por hora de la sala inválido.");
    }

    // Calcular el precio total
    const precioTotal = precio * duracionEnHoras;
    console.log(`Precio total: ${precioTotal}`);

    const nuevaReserva = new ReservasModel({
      idUsuario: usuarioId,
      idSala: salaDisponible._id,
      nombreSala: salaDisponible.nombre,
      fecha: fechaReserva,
      horarioInicio,
      horarioFin,
      cantidadPersonas,
      precioTotal, 
    });

    await nuevaReserva.save();
    console.log("Reserva creada:", nuevaReserva);

    return { reserva: nuevaReserva, nombreSala: salaDisponible.nombre, precioTotal };
  } catch (error) {
    throw new Error(error.message);
  }
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
 const result = await preference.create({
  body:{
    items: [
      {
        id: '1234', // ID de tu reserva
        title: 'Reserva de Sala', // Nombre del ítem
        description: 'Reserva para la sala premium', // Descripción del ítem
        quantity: 1, // Cantidad de ítems (puede ser 1 para una reserva)
        currency_id: 'ARS', // Moneda
        unit_price: 1500 // Precio unitario en ARS
      }
    ],
    back_urls:{
      success:'frontyadeployado',
      failure:'front',
      pending:'front'
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

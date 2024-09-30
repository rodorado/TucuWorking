const ReservasModel = require("../models/reservas.schemas"); 
const SalasModel = require("../models/salas.schemas"); 
const TipoModel = require("../models/tipos.schemas");
const CategoriaModel = require("../models/categorias.schemas");

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
  try {
    const fechaReserva = new Date(fecha);
    if (isNaN(fechaReserva.getTime())) {
      throw new Error("Fecha inválida.");
    }
    const tipoDeSala = await TipoModel.findOne({ nombre: tipoDeSalaNombre });
    const categoriaDeSala = await CategoriaModel.findOne({
      nombre: categoriaDeSalaNombre,
    });

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
    const salaDisponible = await SalasModel.findOne({
      tipoDeSala: tipoDeSala._id,
      categoriaDeSala: categoriaDeSala._id,
      capacidad: { $gte: cantidadPersonas },
      disponibilidad: true,
    });

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

      if (!otraSala) {
        throw new Error(
          "Sala llena. No se encontró otra sala disponible con las mismas características."
        );
      } else {
        const nuevaReserva = new ReservasModel({
          idUsuario: usuarioId,
          idSala: otraSala._id,
          nombreSala: otraSala.nombre,
          fecha: fechaReserva,
          horarioInicio,
          horarioFin,
          cantidadPersonas,
        });

        await nuevaReserva.save();
        return { reserva: nuevaReserva, nombreSala: otraSala.nombre };
      }
    }
    const nuevaReserva = new ReservasModel({
      idUsuario: usuarioId,
      idSala: salaDisponible._id,
      nombreSala: salaDisponible.nombre,
      fecha: fechaReserva,
      horarioInicio,
      horarioFin,
      cantidadPersonas,
    });

    await nuevaReserva.save();
    console.log("Reserva creada:", nuevaReserva);

    return { reserva: nuevaReserva, nombreSala: salaDisponible.nombre };
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


module.exports = {
  crearReserva,
  obtenerTodasLasReservas,
  obtenerUnaReserva,
  actualizarReserva,
  borrarReserva
};

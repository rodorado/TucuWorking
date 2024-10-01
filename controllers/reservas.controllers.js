const reservasServices = require("../services/reservas.services");
const { validationResult } = require("express-validator");

//GET
const obtenerReservas = async (req, res) => {
  try {
    const reservas = await reservasServices.obtenerTodasLasReservas();
    res.status(200).json(reservas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las reservas" });
  }
};
//GET ONE
const obtenerReserva = async (req, res) => {
  try {
    const id = req.params.idReserva;
    const reserva = await reservasServices.obtenerUnaReserva(id);

    if (reserva) {
      res.status(200).json(reserva);
    } else {
      res.status(404).json({ mensaje: "Reserva no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la reserva" });
  }
};
//POST
const crearUnaReserva = async (req, res) => {
  const { errors } = validationResult(req);

  if (errors.length) {
    return res.status(422).json({ message: errors[0].msg });
  }

  const {
    idUsuario,
    tipoDeSala,
    categoriaDeSala,
    fecha,
    horarioInicio,
    horarioFin,
    cantidadPersonas,
  } = req.body;

  try {
    const { reserva, nombreSala, precioTotal } = await reservasServices.crearReserva(
      idUsuario,
      tipoDeSala,
      categoriaDeSala,
      fecha,
      horarioInicio,
      horarioFin,
      cantidadPersonas
    );

    return res.status(201).json({
      message: "Reserva creada con éxito",
      reserva,
      nombreSala,
      precioTotal: `Precio total a pagar: ${precioTotal} ARS`, // Mostrar el precio total calculado
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};


//PUT
const actualizarUnaReserva = async (req, res) => {
  try {
    const { errors } = validationResult(req);

    if (errors.length) {
      return res.status(422).json({ message: errors[0].msg });
    }
    const result = await reservasServices.actualizarReserva(
      req.body,
      req.params.idReserva
    );
  
    if (result.statusCode === 200) {
      res.status(200).json({ msg: result.msg, reserva: result.reserva });
    } else {
      res.status(500).json({ msg: "Error al traer la reserva" });
    }
  } catch (error) {
    console.log(error)
  }
}
//DELETE
const eliminarUnaReserva = async (req, res) => {
  try {
    const result = await reservasServices.borrarReserva(req.params.idReserva);
  
    if (result.statusCode === 200) {
      res.status(200).json({ msg: result.msg });
    } else {
      res.status(500).json({ msg: "Error al eliminar la reserva" });
    }
  } catch (error) {
    console.log(error);
  }
};



module.exports = {
  crearUnaReserva,
  obtenerReserva,
  obtenerReservas,
  actualizarUnaReserva,
  eliminarUnaReserva
};

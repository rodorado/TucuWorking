const SalasModel = require('../models/salas.schemas')


//get
const obtenerTodasLasSalas = async() => {
  const traerSalas = await SalasModel.find()
  return traerSalas;
};
const obtenerUnaSala = async(id) => {
  const sala = await SalasModel.findOne({_id: id})
  return sala;
};

//post
const crearSala = (body) => {
  try {
    const newSala = new SalasModel(body)
    return newSala
  } catch (error) {
    console.log(error);
  }
};

//put
const editarUnaSala = async (idSala, data) => {
  try {
      const salaModificada = await SalasModel.findByIdAndUpdate({_id: idSala}, data, {new: true})
      return salaModificada
  } catch (error) {
    console.log(error);
    return null;
  }
};

//delete
const borrarUnaSala = async(idSala) => {
  try {
    await SalasModel.findByIdAndDelete({_id: idSala})
    return 200
  } catch (error) {
    console.log(error);
  }
};

/*const cambiarDisponibilidad = (idSala) => {
  try {
      const posicionSala = salas.findIndex((sala) => sala.idSala === idSala);
      if (posicionSala !== -1) {  // Asegúrate de que se encontró la sala
          salas[posicionSala].Disponible = !salas[posicionSala].Disponible;
          const mensaje = salas[posicionSala].Disponible ? 'Sala disponible' : 'Sala no disponible';
          return mensaje;
      } else {
          return 'Sala no encontrada';
      }
  } catch (error) {
      console.log(error);
  }
};*/
const habilitarSala = async (idSala) =>{ 
  const sala = await SalasModel.findById(idSala);

  if (!sala) {
    throw new Error('Sala no encontrada');
  }

  sala.disponibilidad = true;
  await sala.save();

  return {
    msg: 'Sala habilitada',
    statusCode: 200
  };
};

const deshabilitarSala = async (idSala) =>{ 
  const sala = await SalasModel.findById(idSala);

  if (!sala) {
    throw new Error('Sala no encontrada');
  }

  sala.disponibilidad = true;
  await sala.save();

  return {
    msg: 'Sala deshabilitada',
    statusCode: 200
  };
};


module.exports = {
  obtenerTodasLasSalas,
  obtenerUnaSala,
  crearSala,
  editarUnaSala,
  borrarUnaSala,
  habilitarSala,
  deshabilitarSala
};

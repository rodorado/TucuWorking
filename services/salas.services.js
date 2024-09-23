const SalasModel = require('../models/salas.schemas')


//get
const obtenerTodasLasSalas = async (limit, to, verDeshabilitadas) => {
  try {
    // Cambia la lógica según el parámetro verDeshabilitadas
    const query = verDeshabilitadas ? {} : { disponibilidad: true }; // Si se quiere ver deshabilitadas, no se aplica el filtro

    const [salas, cantidadTotal] = await Promise.all([
      SalasModel.find(query).skip(to * limit).limit(limit),
      SalasModel.countDocuments(verDeshabilitadas ? {} : { disponibilidad: true })
    ]);

    const paginacion = {
      salas,
      cantidadTotal
    };

    return paginacion;
  } catch (error) {
    console.log(error);
  }
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

  sala.disponibilidad = false;
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

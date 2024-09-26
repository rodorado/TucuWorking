const SalasModel = require('../models/salas.schemas')
const cloudinary = require('../helpers/cloudinary');
const TipoModel = require('../models/tipos.schemas')
const CategoriaModel = require('../models/categorias.schemas')
const dayjs = require('dayjs');

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
const crearSala = async (body) => {
  try {
    const { tipoDeSala, categoriaDeSala, horariosDisponibles } = body;

    // Buscar los ObjectId de Tipo y Categoria basados en el nombre (en vez de recibir ObjectId)
    const tipo = await TipoModel.findOne({ nombre: tipoDeSala });
    const categoria = await CategoriaModel.findOne({ nombre: categoriaDeSala });

    if (!tipo || !categoria) {
      throw new Error('Tipo o Categoría no encontrados en la base de datos');
    }

    // Establecer capacidad y precio en función del tipo y la categoría
    const capacidad = tipo.capacidad;

    // Validar y ajustar horarios con dayjs si es necesario
    const horarios = horariosDisponibles.map((horario) => {
      return {
        fecha: dayjs(horario.fecha).format('YYYY-MM-DD'),
        horaInicio: dayjs(horario.horaInicio, 'HH:mm').format('HH:mm'),
        horaFin: dayjs(horario.horaFin, 'HH:mm').format('HH:mm'),
      };
    });

    // Crear nueva sala con los valores calculados y los ObjectId de Tipo y Categoria
    const newSala = new SalasModel({
      ...body,
      tipoDeSala: tipo._id, // Guardar el ObjectId de tipo
      categoriaDeSala: categoria._id, // Guardar el ObjectId de categoría
      capacidad,
      horariosDisponibles: horarios,
    });

    await newSala.save();
    return newSala;
  } catch (error) {
    console.log(error);
    throw new Error("Error al crear la sala");
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

const agregarImagen = async(idSala, file)=>{
  const sala = await SalasModel.findOne({_id:idSala})
  const resultado = await cloudinary.uploader.upload(file.path)
  
  sala.imagen = resultado.secure_url

  await sala.save()
  return 200
};


module.exports = {
  obtenerTodasLasSalas,
  obtenerUnaSala,
  crearSala,
  editarUnaSala,
  borrarUnaSala,
  habilitarSala,
  deshabilitarSala,
  agregarImagen
};

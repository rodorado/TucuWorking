const SalasModel = require('../models/salas.schemas')
const cloudinary = require('../helpers/cloudinary');
const TipoModel = require('../models/tipos.schemas')
const CategoriaModel = require('../models/categorias.schemas')

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
    const { tipoDeSala, categoriaDeSala, capacidad, horariosDisponibles } = body;

    const tipo = await TipoModel.findOne({ nombre: tipoDeSala });
    const categoria = await CategoriaModel.findOne({ nombre: categoriaDeSala });

    if (!tipo || !categoria) {
      throw new Error('Tipo o Categoría no encontrados en la base de datos');
    }

    const horarios = horariosDisponibles.map((horario) => {
      // Verificar formato básico (esto es opcional, solo por seguridad)
      if (!horario.fecha || !horario.horaInicio || !horario.horaFin) {
        throw new Error('Fecha u hora en formato incorrecto');
      }
      return {
        fecha: horario.fecha,
        horaInicio: horario.horaInicio,
        horaFin: horario.horaFin
      };
    });

    const newSala = new SalasModel({
      ...body,
      tipoDeSala: tipo._id,
      categoriaDeSala: categoria._id,
      capacidad,
      horariosDisponibles: horarios
    });

    await newSala.save();
    return newSala;
  } catch (error) {
    console.error("Error al crear la sala:", error);
    throw new Error("Error al crear la sala");
  }
};

//put
const editarUnaSala = async (idSala, data) => {
  try {
    const { nombreSala, horariosDisponibles, categoriaDeSala, tipoDeSala } = data;

    // Buscamos la sala por su ID
    const sala = await SalasModel.findById(idSala);

    if (!sala) {
      throw new Error('Sala no encontrada');
    }

    // Si se proporciona un nuevo nombre de sala, lo actualizamos
    if (nombreSala) {
      sala.nombreSala = nombreSala;
    }

    // Si se proporcionan nuevos horarios, los actualizamos
    if (horariosDisponibles && Array.isArray(horariosDisponibles)) {
      const nuevosHorarios = horariosDisponibles.map((horario) => {
        if (!horario.fecha || !horario.horaInicio || !horario.horaFin) {
          throw new Error('Fecha u hora en formato incorrecto');
        }
        return {
          fecha: horario.fecha,
          horaInicio: horario.horaInicio,
          horaFin: horario.horaFin
        };
      });
      sala.horariosDisponibles = nuevosHorarios;
    }

    // Si se proporciona una nueva categoría de sala, validamos y actualizamos
    if (categoriaDeSala) {
      const categoria = await CategoriaModel.findOne({ nombre: categoriaDeSala });
      if (!categoria) {
        throw new Error('Categoría no encontrada');
      }
      sala.categoriaDeSala = categoria._id;
    }

    // Si se proporciona un nuevo tipo de sala, validamos y actualizamos
    if (tipoDeSala) {
      const tipo = await TipoModel.findOne({ nombre: tipoDeSala });
      if (!tipo) {
        throw new Error('Tipo de sala no encontrado');
      }
      sala.tipoDeSala = tipo._id;
    }

    // Guardamos los cambios en la sala
    await sala.save();
    return sala;
  } catch (error) {
    console.error("Error al editar la sala:", error);
    throw new Error("Error al editar la sala");
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

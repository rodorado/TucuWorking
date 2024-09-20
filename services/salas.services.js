let salas = [
  {
    id: 1,
    nombre: "Sala 1",
    tipo: "privada",
    capacidad: 10,
    precio: 5000,
    Disponible: false,
  },
  {
    id: 2,
    nombre: "Sala 2",
    tipo: "compartida",
    capacidad: 10,
    precio: 5000,
    Disponible: false,
  },
];


//get
const obtenerTodasLasSalas = () => {
  return salas;
};
const obtenerUnaSala = (id) => {
  const sala = salas.find((salita) => salita.id === id);
  return sala;
};

//post
const crearSala = (body) => {
  try {
    const nuevaSala = {
      id: salas.length > 0 ? salas[salas.length - 1].id + 1 : 1, Disponible: false,
      ...body,
    };
    salas.push(nuevaSala);
    return nuevaSala;
  } catch (error) {
    console.log(error);
  }
};

//put
const editarUnaSala = (idSala, data) => {
  try {
    const posicionSala = salas.findIndex(
      (sala) => sala.id === idSala
    );

    if (posicionSala === -1) {
      return null;
    }
    const salaEditada = {
      ...salas[posicionSala],
      ...data,
    };

    salas[posicionSala] = salaEditada;

    return salaEditada;
  } catch (error) {
    console.log(error);
    return null;
  }
};

//delete
const borrarUnaSala = (idSala) => {
  try {
    const posicionSalaEnElArray = salas.findIndex(
      (sala) => sala.id === idSala
    );
    salas.splice(posicionSalaEnElArray, 1);
    return 200;
  } catch (error) {
    console.log(error);
  }
};

const cambiarDisponibilidad = (idSala) =>{
    try {
        const posicionSala = salas.findIndex((sala)=> sala.idSala === idSala)
        salas[posicionSala].Disponible = !salas[posicionSala].Disponible
        const mensaje = salas[posicionSala].Disponible ? 'Sala no disponible' : 'Sala disponible'
        return mensaje;
    } catch (error) {
       console.log(error) 
    }
}

module.exports = {
  obtenerTodasLasSalas,
  obtenerUnaSala,
  crearSala,
  editarUnaSala,
  borrarUnaSala,
  cambiarDisponibilidad
};

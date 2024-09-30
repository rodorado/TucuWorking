require('../db/config')
const express = require("express");
const path = require("path");
const cors = require("cors")
require('dotenv').config();
const morgan = require('morgan')


class Server {
  constructor() {
    this.app = express()
    this.port = process.env.PORT || 8080

    this.middlewares()
    this.routes()
  }

  middlewares() {
    /*middelwares*/
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, "public")));
    this.app.use(cors())
    this.app.use(morgan('dev'))
  }

  routes(){
    this.app.use("/api/salas", require('../routes/salas.routes'))
    this.app.use("/api/usuarios", require('../routes/usuarios.routes'))
    this.app.use("/api/categorias", require('../routes/categorias.routes'))
    this.app.use("/api/tipos", require('../routes/tipos.routes'))
    this.app.use("/api/reservas", require('../routes/reservas.routes'))
  }

  listen() {
    //servidor funcionando
    this.app.listen(this.port, () => {
      console.log("Servidor funcionando en el puerto", this.port);
    });
  }
}

module.exports = Server
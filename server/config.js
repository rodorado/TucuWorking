require('../db/config')
const express = require("express");
const path = require("path");
const cors = require("cors")
require('dotenv').config();
const morgan = require('morgan')

//Swagger
const swaggerUI = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerSpec = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TucuWorking",
      version: "1.0.0"
    },
    servers: [
      {
        url: "http://localhost:3001"
      }
    ],
    components: {  // Mover 'components' aquí dentro de 'definition'
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // Para especificar que el token es de tipo JWT
        },
      },
    },
    security: [  // Mover 'security' también dentro de 'definition'
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [`${path.join(__dirname, "../routes/*.js")}`],  // Ruta donde Swagger buscará las definiciones de rutas
};



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
    this.app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(swaggerJSDoc(swaggerSpec)))
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
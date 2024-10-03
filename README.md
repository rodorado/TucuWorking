# 🚀 TucuWorking

## Descripción 📝
**TucuWorking** es el proyecto final del curso de **Backend: Integración de Bases de Datos en Aplicaciones Web**, Comisión back1 de **Rolling Code School Tucumán**. Se trata de un sistema de reservación de salas para coworking que permite a los clientes:

- 🔒 Registrarse y autenticarse.
- 🏢 Seleccionar el tipo de sala: privada, compartida, conferencia y reunión.
- 🏷️ Elegir la categoría: economy, confort y premium.
- 📅 Seleccionar la fecha y el horario (desde-hasta) para la reserva.
- 💳 Pagar a través de Mercado Pago.
- 📧 Recibir una confirmación por correo electrónico una vez realizada la reserva.

Los **administradores** pueden gestionar el CRUD de salas, tipos, categorías y usuarios, además de editar las disponibilidades, horarios y días.

### 🛠️ Tecnologías Utilizadas
#### Lenguajes y Frameworks:

- Node.js
- Express.js
- MongoDB

#### Autenticación:
- JWT (JSON Web Tokens)

#### Herramientas de Prueba:

- Postman
- Swagger
  
### 📦 Dependencias y Librerías

- bcrypt ^5.1.1
- cloudinary ^2.5.0
- cors ^2.8.5
- dayjs ^1.11.13
- dotenv ^16.4.5
- express ^4.19.2
- express-validator ^7.2.0
- jsonwebtoken ^9.0.2
- mongoose ^8.6.3
- morgan ^1.10.0
- multer ^1.4.5-lts.1
- nodemailer ^6.9.15
- nodemon ^3.1.4
- mercadopago ^2.0.15
- Swagger
  
#### ⚙️ Requisitos Previos
Antes de ejecutar el proyecto, asegúrate de tener instalado lo siguiente:

1. Node.js (v14 o superior)
2. MongoDB (puede ser local o en la nube)
3. Cuenta en Mercado Pago para las integraciones de pago
4. Cuenta de correo electrónico para el envío de confirmaciones

**Además, deberás configurar las variables de entorno en un archivo .env con los datos adicionales y de seguridad necesarios** (estas no se incluyen en el repositorio por seguridad).

### 🛠️ Instrucciones de Instalación
1. **Clonar el repositorio**

   git clone https://github.com/tu-usuario/tucuworking.git
   
2. **Navegar al directorio del proyecto**

   cd tucuworking
   
3. **Instalar las dependencias**
   
   npm install
   
4. **Configurar las variables de entorno:**
   
   Crea un archivo .env en la raíz del proyecto y añade las variables necesarias según las necesidades del proyecto (por ejemplo, claves de API, URI de MongoDB, etc.).
   
5. Hacer correr el servidor
    
   npm run dev

### 📡 Uso de la API
Las principales rutas de la API están desplegadas en Vercel y se pueden acceder agregando /api al final de la URL base:

https://tucu-working.vercel.app/

#### Endpoints Principales

- **Salas Disponibles:** /api/salas
- **Tipos de Salas:** /api/tipos
- **Categorías:** /api/categorias
- **Reservas (solo para administradores):** /api/reservas
- **Usuarios (solo para administradores):** /api/usuarios

**Ejemplo de Uso**
Para obtener las salas disponibles:

https://tucu-working.vercel.app/api/salas

### 🧪 Información sobre Pruebas

- Postman: Utilizado para probar y documentar las diferentes rutas de la API.
- Swagger: Documentación interactiva de la API disponible en la ruta correspondiente del proyecto.

### 🤝 Contribución
Este proyecto fue desarrollado por el **Grupo 8 de Rolling Code School Tucumán:**

- **Dorado Rocío Jimena**
- **Filsinger Aixa Macarena**
- **Juárez Benjamín**

**Si deseas contribuir, por favor contacta a alguno de los miembros del grupo o abre un issue en el repositorio.**

### ¡Disfrutá utilizando TucuWorking! 🎉




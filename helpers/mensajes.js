const transporter = require(`../helpers/nodemailer`);

const registroUsuario = async (emailUsuario) => {
  await transporter.sendMail({
    from: `Bienvenido a nuestra pagina!!!👻" <${process.env.GMAIL_USER}>`,
    to: emailUsuario,
    subject: "Bienvenido",
    html: `

        <div>
          <h2>Bienvenido</h2>
        </div>

      `,
  });
};

const msgRecuContrasenia = async (email, token) => {
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Recuperación de contraseña",
    text: `Para restablecer tu contraseña,
     haz clic en el siguiente enlace: ${process.env.FRONTEND_URL}/reset-password/${token}`,
  });
};

const registroReserva = async (
  emailUsuario,
  { nombreSala, fecha, horarioInicio, horarioFin, precioTotal }
) => {
  try {
    await transporter.sendMail({
      from: `Reservas - Sala Eventos <${process.env.GMAIL_USER}>`,
      to: emailUsuario,
      subject: "Reserva confirmada",
      html: `
        <div>
          <h2>Reserva confirmada</h2>
          <p>¡Gracias por realizar tu reserva! Aquí tienes los detalles:</p>
          <ul>
            <li><strong>Sala:</strong> ${nombreSala}</li>
            <li><strong>Fecha:</strong> ${new Date(
              fecha
            ).toLocaleDateString()}</li>
            <li><strong>Horario de inicio:</strong> ${horarioInicio}</li>
            <li><strong>Horario de fin:</strong> ${horarioFin}</li>
            <li><strong>Precio total:</strong> ${precioTotal} ARS</li>
          </ul>
          <p>¡Te esperamos!</p>
        </div>
      `,
    });
    console.log("Correo de reserva enviado con éxito");
  } catch (error) {
    console.error("Error al enviar el correo:", error);
  }
};

module.exports = {
  registroUsuario,
  msgRecuContrasenia,
  registroReserva,
};

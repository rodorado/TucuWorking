const transporter = require(`../helpers/nodemailer`)

const registroUsuario = async(emailUsuario) =>  {
    // send mail with defined transport object
     await transporter.sendMail({
      from: `Bienvenido a nuestra pagina!!!👻" <${process.env.GMAIL_USER}>`, // sender address
      to: emailUsuario, // list of receivers
      subject: "Bienvenido", // Subject line
      html: `

        <div>
          <h2>Bienvenido</h2>
        </div>

      `, // html body
    });
  }

  const msgRecuContrasenia= async(email, token) => {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
    to: email,
    subject: 'Recuperación de contraseña',
    text: `Para restablecer tu contraseña,
     haz clic en el siguiente enlace: ${process.env.FRONTEND_URL}/reset-password/${token}`
    })
    
  };

  module.exports = {
    registroUsuario,
    msgRecuContrasenia
  }
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

  module.exports = {
    registroUsuario
  }
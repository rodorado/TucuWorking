const transporter = require(`../helpers/nodemailer`);

const registroUsuario = async (email) => {
  const info = await transporter.sendMail({
    from: `Bienvenido a nuestra pagina!!!👻" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Bienvenido",
    html: `
      <div>
        <h2>Bienvenido</h2>
      </div>
    `,
  });
  return `Mensaje enviado: ${info.messageId}`;
};

module.exports = {
  registroUsuario,
};

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.GMAIL_USER, //no olvidar poner el mail
    pass: process.env.GMAIL_PASS, //no olvidar poner contraseñia
  },
});

module.exports = transporter

const jwt = require("jsonwebtoken");

module.exports = (rol) => (req, res, next) => {

    const token = req.header('auth')
    if (!token) {
      return res.status(409).json({ msg: 'Token incorrecto' })
    }

  try {
    const verify = jwt.verify(token, process.env.JWT_SECRET);

    if (rol === verify.rol) {
      return next();
    } else {
      return res.status(401).json({ msg: "Imposible el acceso" });
    }
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      res.status(500).json({ msg: "token incorrecto" });
      console.log(error);
    }
  }
};

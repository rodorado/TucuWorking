require('dotenv').config();

const mongoose = require("mongoose");



try {
  mongoose.connect(process.env.MONGODB_CONNECT).then(() => console.log('DB Conectada'))

} catch (error) {
  console.log(error);
}

module.exports = mongoose
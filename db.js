const mongoose = require('mongoose');
const dotEnv = require('dotenv');
const path = require('path');

dotEnv.config(path.join(__dirname, 'config.env'));

const { DB_CONNECTION } = process.env;

module.exports = mongoose
  .connect(DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('Connection to DB Successful ! 😆');
  })
  .catch(err => [
    console.log('connection to DB has failed ! 😥 \n Error:', err)
  ]);

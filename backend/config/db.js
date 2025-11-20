const config = require('config');
const mongoose = require('mongoose');
const messages = require('./messages.json');

const db = process.env.MONGODBURI || config.get('MONGODBURI');

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });

    console.log(messages.DB_CONN_SUCCESS);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

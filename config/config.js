const dotenv = require('dotenv');
dotenv.config();

const env = process.env.NODE_ENV || 'development';

module.exports = {
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PORT: process.env.DB_PORT,
  PASSWORD: process.env.DB_PWD,
  DB: process.env.DB_NAME,
  JWT_SECRET: process.env.JWT_SECRET,
};


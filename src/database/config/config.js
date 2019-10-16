/* eslint-disable no-console */
import dotenv from 'dotenv';

dotenv.config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    dialectOption: {
      ssl: true,
      native: true,
    },
    logging: null,
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.TEST_DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    dialectOption: {
      ssl: true,
      native: true,
    },
    logging: null,
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOption: {
      ssl: true,
      native: true,
    },
    logging: null,
  }
};

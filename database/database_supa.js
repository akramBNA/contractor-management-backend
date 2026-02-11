const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME_2,
  process.env.DB_USER_2,
  process.env.DB_PASSWORD_2,
  {
    host: process.env.DB_HOST_2,
    port: process.env.DB_PORT_2,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

module.exports = { sequelize };

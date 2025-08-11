// const { Pool } = require('pg');
// const { Sequelize, DataTypes } = require('sequelize');
// const dns = require('dns');

// dns.lookup(process.env.DB_HOST_2, { all: true }, (err, addresses) => {
//   if (err) console.error(err);
//   else console.log('Resolved DB IPs:', addresses);
// });


// const sequelize = new Sequelize(process.env.DB_NAME_2, process.env.DB_USER_2, process.env.DB_PASSWORD_2, {
//   host: process.env.DB_HOST_2,
//   dialect: 'postgres',
//   port: process.env.DB_PORT_2,
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false,
//     },
//   },
// });

// const pool = new Pool({
//   user: process.env.DB_USER_2,
//   host: process.env.DB_HOST_2,
//   database: process.env.DB_NAME_2,
//   password: process.env.DB_PASSWORD_2,
//   port: process.env.DB_PORT_2,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// pool.connect((err) => {
//   if (err) {
//     console.error('Connection error', err.stack);
//   } else {
//     console.log('Connected to the database');
//   }
// });

// module.exports = {
//   pool,
//   sequelize
// };
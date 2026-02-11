const { Sequelize, DataTypes } = require("sequelize");
const useSupa = process.env.USE_SUPA === 'true';
const { sequelize } = useSupa ? require('../database/database_supa') : require('../database/database');

const attendances = sequelize.define(
  "attendances",
  {},
  {
    timestamps: false,
  }
);

module.exports = { attendances, sequelize };

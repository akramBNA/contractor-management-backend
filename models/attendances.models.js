const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../database/database.js");


const attendances = sequelize.define(
  "attendances",
  {},
  {
    timestamps: false,
  }
);

module.exports = { attendances, sequelize };

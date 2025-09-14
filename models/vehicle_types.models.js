const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../database/database.js");

const vehicles = sequelize.define(
  "vehicle_types",
  {
    vehicle_type_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    vehicle_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Y",
    },
  },
  {
    timestamps: false,
  }
);

module.exports = { vehicles, sequelize };

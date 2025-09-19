const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../database/database.js");

const vehicles = sequelize.define(
  "vehicles",
  {
    vehicle_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    vehicle_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "vehicle_types",
        key: "vehicle_type_id",
      },
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    model_year: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    licence_plate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    circulation_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    vin_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    insurance_number: {
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

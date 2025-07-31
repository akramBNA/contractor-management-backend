const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../database/database.js");

const holidays = sequelize.define(
  "holidays",
  {
    holiday_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    holiday_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    holiday_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    active: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "Y",
    },
  },
  {
    timestamps: false,
  }
);

module.exports = {
  holidays,
  sequelize,
};

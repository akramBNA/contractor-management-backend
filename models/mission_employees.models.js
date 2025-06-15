const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../database/database.js");

const mission_employees = sequelize.define(
  "mission_employees",
  {
    mission_employees_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    mission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    active: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Y',
    },
  },
  {
    timestamps: false,
  }
);

module.exports = {
  mission_employees,
};

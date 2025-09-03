const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../database/database.js");

const project_employees = sequelize.define(
  "project_employees",
  {
    project_employees_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    project_id: {
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
  project_employees,
};

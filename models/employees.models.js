const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../database/database.js");

const employees = sequelize.define(
  "employees",
  {
    employee_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    employee_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    employee_lastname: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      employee_phone_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      employee_email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      employee_adress: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      employee_national_number: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true,
      },
      employee_image_id: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      employee_bank_details_id: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
    active: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Y",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = {
  employees,
  sequelize,
};

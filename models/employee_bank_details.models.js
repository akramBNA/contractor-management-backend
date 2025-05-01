const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../database/database.js");

const employee_bank_details = sequelize.define(
  "employee_bank_details",
  {
    bank_details_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    account_holder_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    account_number: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    },
    bank_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    branch_location: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    tax_payer_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
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
  employee_bank_details,
  sequelize,
};

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
    },
    account_number: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    bank_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    branch_location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tax_payer_id: {
      type: DataTypes.BIGINT,
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

module.exports = {
  employee_bank_details,
  sequelize,
};

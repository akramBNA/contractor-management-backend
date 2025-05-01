const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../database/database.js");

const contracts = sequelize.define(
  "contracts",
  {
    contract_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    contract_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    salary: {
      type: DataTypes.INTEGER,
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
  contracts,
  sequelize,
};

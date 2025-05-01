const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../database/database.js");

const contracts_types = sequelize.define(
  "contracts_types",
  {
    contract_type_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    contract_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    leaves_credit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      defaultValue: 0,

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
  contracts_types,
  sequelize,
};

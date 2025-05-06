const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../database/database.js");

const contract_types = sequelize.define(
  "contract_types",
  {
    contract_type_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    contract_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    leaves_credit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,

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
  contract_types,
  sequelize,
};

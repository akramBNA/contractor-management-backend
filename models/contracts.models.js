const { Sequelize, DataTypes } = require("sequelize");
const useSupa = process.env.USE_SUPA === 'true';
const { sequelize } = useSupa ? require('../database/database_supa') : require('../database/database');

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
    },
    salary: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
  contracts,
  sequelize,
};

const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../database/database.js");

const company = sequelize.define(
  "company",
  {
    company_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company_representative_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    company_activity_field: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company_tax_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company_commercial_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company_ss_id: {
      type: DataTypes.STRING,
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
  company,
  sequelize,
};

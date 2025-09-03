const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../database/database.js");

const company = sequelize.define(
  "company",
  {
    company_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company_activity_field: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company_representative_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    company_tax_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    company_ss_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    company_establishment_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    active: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Y",
    },
  },
  {
    tableName: "company",
    freezeTableName: true,
    timestamps: false,
  }
);


module.exports= company


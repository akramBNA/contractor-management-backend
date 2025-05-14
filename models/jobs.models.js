const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../database/database.js");

const jobs = sequelize.define(
  "jobs",
  {
    job_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    job_name: {
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
  jobs,
  sequelize,
};

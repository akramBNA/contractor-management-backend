const { Sequelize, DataTypes } = require("sequelize");
const useSupa = process.env.USE_SUPA === 'true';
const { sequelize } = useSupa ? require('../database/database_supa') : require('../database/database');

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

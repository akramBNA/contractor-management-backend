const { Sequelize, DataTypes } = require("sequelize");
const useSupa = process.env.USE_SUPA === 'true';
const { sequelize } = useSupa ? require('../database/database_supa') : require('../database/database');
const company_configs = sequelize.define(
  "company_configs",
  {
    company_config_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    payroll_cycle_start_day: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    leave_accrual_rate: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 1,
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
  company_configs,
  sequelize,
};

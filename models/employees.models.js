const { Sequelize, DataTypes } = require("sequelize");
const useSupa = process.env.USE_SUPA === 'true';
const { sequelize } = useSupa ? require('../database/database_supa') : require('../database/database');

const employees = sequelize.define(
  "employees",
  {
    employee_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    employee_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    employee_lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    employee_matricule: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    employee_gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    employee_birth_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    employee_national_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    employee_phone_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    employee_email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    employee_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    employee_job_title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    employee_joining_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    employee_end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    employee_image_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    employee_bank_details_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    employee_contract_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    leave_credit: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
  employees,
  sequelize,
};

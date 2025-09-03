const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../database/database.js");

const missions = sequelize.define(
  "missions",
  {
    mission_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    mission_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mission_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    start_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    priority: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'LOW',
    },
    expenses: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    active: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Y',
    },
  },
  {
    timestamps: false,
  }
);

module.exports = {
  missions,
};

const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../database/database.js");

const leave_types = sequelize.define(
  "leave_types",
  {
    leave_type_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      references: {
        model: "leave_types",
        key: "leave_type_id",
      },
    },
    leave_type_name: {
      type: DataTypes.TEXT,
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
  leave_types,
  sequelize,
};

const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../database/database.js");

const roles = sequelize.define(
  "roles",
  {
    role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    role_type: {
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
  roles,
  sequelize,
};

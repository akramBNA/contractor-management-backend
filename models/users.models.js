const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../database/database.js");

const { roles } = require("../models/roles.models.js");

const users = sequelize.define(
  "users",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: roles,
        key: "role_id",
      },
    },
    active: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Y",
    },
  },
  {
    timestamps: true,
  }
);

users.belongsTo(roles, { foreignKey: "user_role_id", as: "roles" });

module.exports = { users, sequelize };

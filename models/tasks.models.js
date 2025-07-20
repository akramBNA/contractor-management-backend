const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../database/database.js");
const { projects } = require("./projects.models.js");

const tasks = sequelize.define(
  "tasks",
  {
    task_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "projects",
        key: "project_id",
      },
      onDelete: "CASCADE",
    },
    task_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    assigned_to: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    duration: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    // priority: {
    //   type: DataTypes.TEXT,
    //   allowNull: false,
    // },
    // status: {
    //   type: DataTypes.TEXT,
    //   allowNull: false,
    // },
    active: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'Y',
    },
  },
  {
    timestamps: false,
  }
);

const defineAssociations = (models) => {
  tasks.belongsTo(projects, {
    foreignKey: "project_id",
  });
};

module.exports = {
  tasks,
  defineAssociations
};

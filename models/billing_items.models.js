const { DataTypes } = require("sequelize");
const useSupa = process.env.USE_SUPA === 'true';
const { sequelize } = useSupa ? require('../database/database_supa') : require('../database/database');
const { billings } = require('./billings.models');

const billing_items = sequelize.define(
  "billing_items",
  {
    item_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    billing_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: false,
    },
    unit_price_ht: {
      type: DataTypes.DECIMAL(15, 3),
      allowNull: false,
    },
    tva_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    tva_amount: {
      type: DataTypes.DECIMAL(15, 3),
      allowNull: false,
    },
    line_total_ht: {
      type: DataTypes.DECIMAL(15, 3),
      allowNull: false,
    },
    line_total_ttc: {
      type: DataTypes.DECIMAL(15, 3),
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

billings.hasMany(billing_items, { foreignKey: "billing_id", onDelete: "CASCADE" });
billing_items.belongsTo(billings, { foreignKey: "billing_id" });

module.exports = { billing_items, sequelize };
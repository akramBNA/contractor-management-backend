const { DataTypes } = require("sequelize");
const useSupa = process.env.USE_SUPA === "true";
const { sequelize } = useSupa
  ? require("../database/database_supa")
  : require("../database/database");

const billings = sequelize.define(
  "billings",
  {
    billing_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    invoice_number: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    invoice_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "pending",
      values: ["pending", "paid", "overdue", "cancelled"],
    },

    seller_company_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    seller_matricule_fiscal: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    seller_address: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },

    buyer_company_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    buyer_matricule_fiscal: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    buyer_address: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },

    subtotal_amount: {
      type: DataTypes.DECIMAL(15, 3),
      allowNull: false,
    },
    discount_amount: {
      type: DataTypes.DECIMAL(15, 3),
      allowNull: false,
      defaultValue: 0,
    },
    tva_amount: {
      type: DataTypes.DECIMAL(15, 3),
      allowNull: false,
      defaultValue: 0,
    },
    total_amount_ht: {
      type: DataTypes.DECIMAL(15, 3),
      allowNull: false,
    },
    total_amount_ttc: {
      type: DataTypes.DECIMAL(15, 3),
      allowNull: false,
    },
    currency: {
      type: DataTypes.CHAR(3),
      allowNull: false,
      defaultValue: "TND",
    },

    tva_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 19.0,
    },
    tva_category: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },

    payment_method: {
      type: DataTypes.STRING(50),
      allowNull: true,
      values: ["virement_bancaire", "cheque", "especes", "traite", "carte"],
    },
    payment_reference: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    paid_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    // El Fatoora / TTN e-invoicing fields (mandatory for large enterprises as of 2025)
    ttn_reference: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ttn_qr_code: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_einvoice: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = { billings, sequelize };

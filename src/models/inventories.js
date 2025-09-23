// models/Inventory.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize"); // adjust path

const Inventory = sequelize.define(
  "Inventory",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    isItemReusable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    billNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    verifiedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    serialNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    itemType: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    value: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    remarks: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // JSON with purchase details
    purchaseDetails: {
      type: DataTypes.JSON,
      allowNull: true,
      // Expected: { purchaseDate, purchasedBy, contactNumber, purchaseAddress, discount }
    },

    issuedTo: {
      type: DataTypes.UUID, // FK → User.id
      allowNull: true,
    },

    issuedBy: {
      type: DataTypes.UUID, // FK → User.id
      allowNull: true,
    },

    issuedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    returnDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    lable: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // JSON with repair details
    repairDetails: {
      type: DataTypes.JSON,
      allowNull: true,
      // Expected: { repairedBy, contactOfRepairedPerson, addressOfRepaired }
    },

    status: {
      type: DataTypes.ENUM("available", "issued", "repair", "disposed"),
      defaultValue: "available",
    },

    officeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "offices",
        key: "id",
      },
    },

    itemType: {
      type: DataTypes.ENUM(
        "pane",
        "notebook",
        "chair",
        "laptop",
        "tv",
        "av",
        "fan",
        "mobile",
        "charger",
        "pandrive"
      ),
      allowNull: false,
    },
  },
  {
    tableName: "inventory",
    timestamps: true, // adds createdAt, updatedAt
  }
);

module.exports = Inventory;

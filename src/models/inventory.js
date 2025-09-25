// Inventory Model: Represents stock items in the system
// Why: Central table for tracking all inventory items (laptops, chairs, etc.)
// Benefit: Enables dynamic, scalable inventory management for multiple offices
const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  // Define Inventory table schema
  const Inventory = sequelize.define("Inventory", {
    // id: {
    //   type: DataTypes.UUID,
    //   defaultValue: DataTypes.UUIDV4,
    //   primaryKey: true,
    // },
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING },
    category: { type: DataTypes.STRING },
    qty: { type: DataTypes.INTEGER, allowNull: false },
    unit_price: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    min_stock: { type: DataTypes.INTEGER, allowNull: true },
    max_stock: { type: DataTypes.INTEGER, allowNull: true },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },
  });

  // Set up associations (relationships)
  Inventory.associate = (models) => {
    // Each inventory item belongs to an office
    Inventory.belongsTo(models.Office, { foreignKey: "office_id" });
  };

  // Return the Inventory model
  return Inventory;
};

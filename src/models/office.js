// Office Model: Represents a physical office location (e.g., NFDC Delhi, NFDC Mumbai)
// Why: Allows inventory, employees, and departments to be managed per office
// Benefit: Enables multi-office support, reporting, and separation of resources
const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  // Define Office table schema
  const Office = sequelize.define("Office", {
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
    name: { type: DataTypes.STRING, allowNull: false }, // Office name
    address: { type: DataTypes.STRING }, // Street address
    city: { type: DataTypes.STRING }, // City
    state: { type: DataTypes.STRING }, // State
    country: { type: DataTypes.STRING }, // Country
  });

  // Set up associations (relationships)
  Office.associate = (models) => {
    // An office has many departments, employees, and inventory items
    Office.hasMany(models.Department, { foreignKey: "office_id" });
    Office.hasMany(models.Employee, { foreignKey: "office_id" });
    Office.hasMany(models.Inventory, { foreignKey: "office_id" });
  };

  // Return the Office model
  return Office;
};

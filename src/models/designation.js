// Designation Model: Represents job titles/roles within a department (e.g., Manager, Clerk)
// Why: Assigns specific roles to employees for hierarchy and permissions
// Benefit: Enables role-based access, reporting, and organizational structure
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  // Define Designation table schema
  const Designation = sequelize.define("Designation", {
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
    title: { type: DataTypes.STRING, allowNull: false }, // Designation title (e.g., Manager, Clerk)
  });

  // Set up associations (relationships)
  Designation.associate = (models) => {
    // Each designation belongs to a department, and can have many employees
    Designation.belongsTo(models.Department, { foreignKey: "department_id" });
    Designation.hasMany(models.Employee, { foreignKey: "designation_id" });
  };

  // Return the Designation model
  return Designation;
};

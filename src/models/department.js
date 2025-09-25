// Department Model: Represents a department within an office (e.g., HR, IT)
// Why: Organizes employees and designations by department for structure and reporting
// Benefit: Enables department-level management, permissions, and reporting
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  // Define Department table schema
  const Department = sequelize.define("Department", {
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
    name: { type: DataTypes.STRING, allowNull: false }, // Department name
  });

  // Set up associations (relationships)
  Department.associate = (models) => {
    // Each department belongs to an office, and has many designations and employees
    Department.belongsTo(models.Office, { foreignKey: "office_id" });
    Department.hasMany(models.Designation, { foreignKey: "department_id" });
    Department.hasMany(models.Employee, { foreignKey: "department_id" });
  };

  // Return the Department model
  return Department;
};

// Employee Model: Represents an employee in the organization
// Why: Stores personal and job-related info for each staff member
// Benefit: Enables HR management, assignment of inventory, and reporting
const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  // Define Employee table schema
  const Employee = sequelize.define("Employee", {
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
    first_name: { type: DataTypes.STRING, allowNull: false }, // Employee first name
    last_name: { type: DataTypes.STRING, allowNull: false }, // Employee last name
    mobile_number: { type: DataTypes.STRING, unique: true }, // Unique mobile number
    date_of_birth: { type: DataTypes.DATEONLY }, // Date of birth
    gender: { type: DataTypes.ENUM("male", "female", "other") }, // Gender
    hire_date: { type: DataTypes.DATEONLY }, // Date of joining
  });

  // Set up associations (relationships)
  Employee.associate = (models) => {
    // Each employee is linked to a user, office, department, and designation
    Employee.belongsTo(models.User, { foreignKey: "user_id" });
    Employee.belongsTo(models.Office, { foreignKey: "office_id" });
    Employee.belongsTo(models.Department, { foreignKey: "department_id" });
    Employee.belongsTo(models.Designation, { foreignKey: "designation_id" });
  };

  // Return the Employee model
  return Employee;
};

// User Model: Represents application users (admin, employee, etc.)
// Why: Central for authentication, authorization, and user management
// Benefit: Supports role-based access, secure login, and user status tracking
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  // Define User table schema
  const User = sequelize.define("User", {
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
    email: { type: DataTypes.STRING, allowNull: false, unique: true }, // Unique user email for login
    password: { type: DataTypes.STRING, allowNull: false }, // Hashed password for security
    role: {
      type: DataTypes.ENUM("admin", "employee", "manager", "hr"),
      defaultValue: "employee",
    }, // User role for access control
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    }, // Account status for enabling/disabling users
  });

  // Set up associations (relationships)
  User.associate = (models) => {
    // Each user can have one employee profile
    User.hasOne(models.Employee, { foreignKey: "user_id" });
  };

  // Return the User model
  return User;
};

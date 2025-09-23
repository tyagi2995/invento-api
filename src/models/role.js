const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Role = sequelize.define(
  "Role",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // e.g., "SuperAdmin", "Admin", "Employee", "Manager"
    },
  },
  {
    tableName: "roles",
    timestamps: false,
  }
);

module.exports = Role;

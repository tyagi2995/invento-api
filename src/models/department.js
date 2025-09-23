const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Department = sequelize.define(
  "Department",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false, // HR, Accounts, IT, Media, etc.
    },
  },
  { tableName: "departments", timestamps: true }
);

module.exports = Department;

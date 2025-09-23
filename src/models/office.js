const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Office = sequelize.define(
  "Office",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false, // Delhi, Mumbai, Pune
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { tableName: "offices", timestamps: true }
);

module.exports = Office;

const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const sequelize = require("../config/sequelize");

const Employee = sequelize.define(
  "Employee",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    first_name: {},
    last_name: {},
    date_of_birth: {},
    gender: {},
    mobile_number: {},
    city: {},
    state: {},
    country: {},
    address: {},
    pincode: {},
    employee_code: {},
    department: {},
    designation: {},
    employment_type: {},
    reporting_manager: {},

    mobileNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    userId: {},

    date_of_joining: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    officeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "offices", // Make sure table name is correct
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },

    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "roles", // Make sure table name is correct
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
  },
  {
    tableName: "employees", // you can rename table to "employees"
    timestamps: true,

    hooks: {
      beforeCreate: async (employee) => {
        if (employee.password) {
          const salt = await bcrypt.genSalt(10);
          employee.password = await bcrypt.hash(employee.password, salt);
        }
      },
      beforeUpdate: async (employee) => {
        if (employee.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          employee.password = await bcrypt.hash(employee.password, salt);
        }
      },
    },
  }
);

// 🔑 Method to compare password
Employee.prototype.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = Employee;

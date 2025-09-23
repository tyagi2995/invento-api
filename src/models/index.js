const sequelize = require("../config/sequelize");
const Role = require("./role");
const User = require("./users");
const Office = require("./office");
const Department = require("./department");
const Inventory = require("./inventories");
const Permission = require("./permission");

// Define relationships
User.belongsTo(Role, { foreignKey: "roleId" });
User.belongsTo(Office, { foreignKey: "officeId" });
Inventory.belongsTo(Office, { foreignKey: "officeId" });
Inventory.belongsTo(User, { foreignKey: "issuedTo", as: "issuedToUser" });
Inventory.belongsTo(User, { foreignKey: "issuedBy", as: "issuedByUser" });
Department.belongsTo(Office, { foreignKey: "officeId" }); // Assuming Department has officeId

const initDB = async () => {
  await sequelize.sync({ alter: true });
  console.log("✅ Database synced");

  // Insert default roles if not exist
  const roles = ["super_admin", "admin", "user"];
  for (let r of roles) {
    await Role.findOrCreate({ where: { name: r } });
  }

  // Insert default permissions
  const permissions = [
    "inventory.read",
    "inventory.write",
    "inventory.delete",
    "users.read",
    "users.write",
    "users.delete",
    "offices.read",
    "offices.write",
    "offices.delete",
  ];
  for (let p of permissions) {
    await Permission.findOrCreate({ where: { name: p } });
  }
};

module.exports = {
  sequelize,
  Role,
  User,
  Office,
  Department,
  Inventory,
  Permission,
  initDB,
};

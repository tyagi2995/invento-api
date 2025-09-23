// src/middleware/validateRole.js
const { Office } = require("../models");

module.exports = function validateRole(roles, officeAccess = false) {
  return (req, res, next) => {
    const user = req.user; // comes from JWT auth
    if (!user || !roles.includes(user.roleName)) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Check office access for non-super admin
    if (officeAccess && user.roleName !== "super_admin") {
      const resourceOfficeId = req.params.officeId || req.body.officeId;
      if (resourceOfficeId && resourceOfficeId !== user.officeId) {
        return res
          .status(403)
          .json({ message: "Access denied to this office" });
      }
    }

    next();
  };
};

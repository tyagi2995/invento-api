// src/middleware/authenticate.js
const jwt = require("jsonwebtoken");
const { User, Role, Office } = require("../models");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user with role and office
    const user = await User.findOne({
      where: { id: decoded.id },
      include: [
        { model: Role, attributes: ["id", "name"] },
        { model: Office, attributes: ["id", "name"] },
      ],
    });

    if (!user) return res.status(401).json({ message: "Invalid user" });

    req.user = {
      id: user.id,
      roleId: user.role.id,
      roleName: user.role.name,
      officeId: user.office.id,
      officeName: user.office.name,
    };

    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized", error: err.message });
  }
};

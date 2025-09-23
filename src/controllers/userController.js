// src/controllers/userController.js
const bcrypt = require("bcryptjs");
const { User, Office, Role } = require("../models/index");

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, roleId, officeId } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      roleId,
      officeId,
    });

    res
      .status(201)
      .json({
        id: user.id,
        name: user.name,
        email: user.email,
        officeId: user.officeId,
        roleId: user.roleId,
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { officeId } = req.user;
    const whereClause = req.user.roleName === "super_admin" ? {} : { officeId };

    const users = await User.findAll({
      where: whereClause,
      include: [
        { model: Office, attributes: ["name"] },
        { model: Role, attributes: ["name"] },
      ],
      attributes: { exclude: ["password"] },
    });

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

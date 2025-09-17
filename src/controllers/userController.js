const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

// ===============================
// Create a new user
// ===============================
exports.createUser = async (req, res) => {
  try {
    const { username, password, role_id, office_id, employee_id } = req.body;

    // Check if username already exists
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res
        .status(400)
        .json({ status: "error", message: "Username already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into DB
    const userId = await User.createUser({
      username,
      password_hash: hashedPassword,
      role_id,
      office_id: office_id || null,
      employee_id: employee_id || null,
    });

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      userId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

// ===============================
// Get all users (optional filter by office)
// ===============================
exports.getAllUsers = async (req, res) => {
  try {
    const officeId = req.query.office_id || null;
    const users = await User.getAllUsers(officeId);

    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

// ===============================
// Get single user by ID
// ===============================
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.getUserById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    res.status(200).json({ status: "success", data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

// ===============================
// Update user
// ===============================
// src/controllers/userController.js
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, password, role_id, office_id, employee_id } = req.body;

    // Check if user exists
    const user = await User.getUserById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    // Hash password if updated
    let hashedPassword = user.password_hash;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    await User.updateUser(userId, {
      username: username || user.username,
      password_hash: hashedPassword,
      role_id: role_id ?? user.role_id,
      office_id: office_id ?? user.office_id,
      employee_id: employee_id ?? user.employee_id,
    });

    res.status(200).json({
      status: "success",
      message: "User updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

// ===============================
// Delete user
// ===============================
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.getUserById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    await User.deleteUser(userId);

    res
      .status(200)
      .json({ status: "success", message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

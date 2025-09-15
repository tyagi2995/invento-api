/**
 * User Controller
 * - Handles business logic for user routes
 */
const { pool } = require("../config/db");
const logger = require("../utils/logger");

exports.getAllUsers = async (req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT id, name, email FROM users");
    res.json({ status: "success", data: rows });
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email FROM users WHERE id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      res.status(404);
      throw new Error("User not found");
    }

    res.json({ status: "success", data: rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const [result] = await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password] // ⚠️ hash password in real project
    );

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      userId: result.insertId,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    await pool.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [
      name,
      email,
      req.params.id,
    ]);

    res.json({ status: "success", message: "User updated" });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await pool.query("DELETE FROM users WHERE id = ?", [req.params.id]);
    res.json({ status: "success", message: "User deleted" });
  } catch (err) {
    next(err);
  }
};

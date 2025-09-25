// bcryptjs: For secure password hashing and comparison
const bcrypt = require("bcryptjs");
// jsonwebtoken: For generating and verifying JWT tokens (stateless authentication)
const jwt = require("jsonwebtoken");
// db: Sequelize models, used for database operations
const db = require("../models");
// logger: Centralized logging for monitoring and debugging
const logger = require("../utils/logger");

// =============================
// User Login Controller
// =============================
// Why: Authenticates users and issues JWT for secure, stateless sessions.
// Benefit: Secure login, scalable session management, role-based access possible.

/**
 * User Login Controller
 * Why: Authenticates users and issues JWT for secure, stateless sessions.
 * Benefit: Secure login, scalable session management, role-based access possible.
 * Improvement: Stores JWT in HttpOnly cookie for better security.
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      logger.warn(`Login failed: User not found (${email})`);
      return res
        .status(401)
        .json({ status: "error", message: "Invalid email or password" });
    }
    if (user.status !== "active") {
      logger.warn(`Login failed: Inactive user (${email})`);
      return res.status(403).json({
        status: "error",
        message: "Account is inactive. Contact admin.",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Login failed: Wrong password (${email})`);
      return res
        .status(401)
        .json({ status: "error", message: "Invalid password" });
    }
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, status: user.status },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    logger.info(`Login success: ${email}`);
    // Set JWT in HttpOnly cookie for security
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development", // HTTPS only in production
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });
    // Exclude password from user info
    const { password: _, ...userInfo } = user.toJSON();
    res.status(200).json({
      status: "success",
      message: "Login successful",
      user: userInfo,
    });
  } catch (error) {
    logger.error("Login error:", error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

// =============================
// User Registration Controller
// =============================
// Why: Allows new users to register with unique email and hashed password.
// Benefit: Prevents duplicate accounts, stores passwords securely, supports role assignment.
exports.createUser = async (req, res, next) => {
  try {
    const { email, password, role, status } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ status: "error", message: "Email and password are required" });
    }
    const existing = await db.User.findOne({ where: { email } });
    if (existing) {
      return res
        .status(409)
        .json({ status: "error", message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.User.create({
      email,
      password: hashedPassword,
      role: role || "employee",
      status: status || "active",
    });
    const { password: _, ...userInfo } = user.toJSON();
    res.status(201).json({ status: "success", user: userInfo });
  } catch (err) {
    next(err);
  }
};

// =============================
// User Verification Controller
// =============================
// Why: Allows frontend or other services to verify if a user exists and is active.
// Benefit: Useful for registration, password reset, or pre-login checks.
exports.verifyUser = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(200)
        .json({ status: "false", message: "Email is required" });
    }
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(200)
        .json({ status: "false", message: "User not found" });
    }
    if (user.status !== "active") {
      return res
        .status(200)
        .json({ status: "false", message: "User is not active" });
    }
    res.status(200).json({
      status: "true",
      message: "success",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    logger.error(`Verify user error: ${err.message}`, { stack: err.stack });
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

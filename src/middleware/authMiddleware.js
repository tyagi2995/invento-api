// src/middleware/authMiddleware.js
// =============================
// JWT Authentication Middleware
// =============================
// Why: Verifies JWT on every request (except /login, /register, /health)
// Benefit: Secures all protected routes, ensures only authenticated users can access API

const jwt = require("jsonwebtoken");

/**
 * Middleware to verify JWT token for protected routes
 * Skips verification for /login, /register, /health endpoints
 */
function authMiddleware(req, res, next) {
  // Allow unauthenticated access to login, register, and health endpoints
  const openPaths = ["/api/login", "/api/register", "/health"];
  if (openPaths.includes(req.path)) {
    return next();
  }

  // Get token from Authorization header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ status: "fail", message: "No token provided" });
  }

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ status: "fail", message: "Invalid or expired token" });
    }
    req.user = user; // Attach user info to request
    next();
  });
}

module.exports = authMiddleware;

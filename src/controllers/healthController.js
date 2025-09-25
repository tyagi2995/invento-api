// getPool: Utility to get a database connection pool
// Why: Used to check DB connectivity for health monitoring
// Benefit: Ensures the API can report its status and DB health to monitoring tools or load balancers
const { getPool } = require("../config/db");

// =============================
// Health Check Controller
// =============================
// Why: Provides a health check endpoint for uptime and DB status
// Benefit: Useful for monitoring, load balancers, and automated deployments
exports.healthCheck = async (req, res) => {
  try {
    const pool = getPool();
    await pool.query("SELECT 1");

    res.status(200).json({
      status: "success",
      message: "Server is healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: "connected",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
      error: error.message,
    });
  }
};

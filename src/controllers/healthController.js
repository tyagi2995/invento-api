const { getPool } = require("../config/db");

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

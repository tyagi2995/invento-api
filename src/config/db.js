const mysql = require("mysql2/promise");
const logger = require("../utils/logger");

let pool; // shared connection pool

// Connect and create the pool
const connectDB = async () => {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // Test the connection
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();

    logger.info("✅ MySQL connected successfully");
  } catch (err) {
    logger.error("❌ MySQL connection failed: " + err.message);
    process.exit(1);
  }
};

// Safe getter to use the pool anywhere
const getPool = () => {
  if (!pool) throw new Error("Database pool not initialized");
  return pool;
};

// Close the pool
const disconnectDB = async () => {
  if (pool) {
    await pool.end();
    logger.info("🛑 MySQL pool closed");
  }
};

module.exports = { connectDB, getPool, disconnectDB };

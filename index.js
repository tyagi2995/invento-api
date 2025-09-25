/**
 * =====================================================
 * Invento API Server - Main Entry Point
 *
 * Why use this file:
 *   - Centralizes all configuration, middleware, and route setup for the backend
 *   - Ensures maintainability, scalability, and security for the inventory system
 *
 * Benefits:
 *   - Modular, well-documented, and easy to extend
 *   - Handles security, logging, validation, error handling, and graceful shutdown
 *
 * Tech Stack: Node.js + Express + MySQL (Sequelize ORM)
 * =====================================================
 */

// =============================
// Load Environment Variables
// =============================
// Why: Allows configuration via .env file instead of hardcoding secrets
require("dotenv").config();

// =============================
// Core & Security Middleware
// =============================
// Why: Protects the API, enables CORS, logging, and request parsing
const express = require("express"); // Express: Fast, minimalist web framework
const cors = require("cors"); // CORS: Allows frontend on other origins to access API
const helmet = require("helmet"); // Helmet: Sets secure HTTP headers (prevents common attacks)
const rateLimit = require("express-rate-limit"); // Rate limiting: Prevents brute force & DoS
const compression = require("compression"); // Compression: Reduces response size for speed
const sanitize = require("./src/middleware/sanitize"); // Sanitizes user input (prevents XSS)
const hpp = require("hpp"); // HPP: Prevents HTTP parameter pollution
const morgan = require("morgan"); // Morgan: HTTP request logger
const sequelize = require("./src/config/sequelize"); // Sequelize: ORM for MySQL

// =============================
// Custom Utilities & Error Handling
// =============================
const { connectDB, disconnectDB, getPool } = require("./src/config/db"); // DB connection helpers
const logger = require("./src/utils/logger"); // Winston-based logger for file/console
const { errorHandler, notFound } = require("./src/middleware/errorMiddleware"); // Centralized error handling

// =============================
// JWT Authentication Middleware
// =============================
// Why: Verifies JWT on every request (except /login, /register, /health)
// Benefit: Secures all protected routes, ensures only authenticated users can access API
const authMiddleware = require("./src/middleware/authMiddleware");

// =============================
// Initialize Express App
// =============================
const app = express();

// =============================
// Trust Proxy
// =============================
// Why: Ensures correct client IPs when behind proxies/load balancers
app.set("trust proxy", 1);

// =============================
// Security Headers (Helmet)
// =============================
// Why: Sets secure HTTP headers to protect against common vulnerabilities
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// =============================
// CORS Configuration
// =============================
// Why: Allows frontend apps on different ports/origins to access the API
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [process.env.FRONTEND_URL]
    : [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5173",
      ];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// =============================
// Rate Limiting
// =============================
// Why: Prevents abuse and DoS attacks by limiting requests per IP
app.use(
  "/api",
  rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 min
    max:
      process.env.NODE_ENV === "production"
        ? parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
        : 1000,
    message: {
      status: "error",
      message: "Too many requests from this IP, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// =============================
// Other Security Middlewares
// =============================
// sanitize: Cleans user input from XSS
// hpp: Prevents HTTP parameter pollution
app.use(sanitize);
app.use(
  hpp({
    whitelist: ["sort", "page", "limit", "fields", "search"],
  })
);

// =============================
// Body Parsing & Compression
// =============================
// Why: Parses incoming requests and compresses responses for performance
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(compression());

// =============================
// Apply JWT Auth Middleware
// =============================
// This will verify JWT for all requests except /login, /register, /health
app.use(authMiddleware);

// =============================
// Request Logging
// =============================
// Why: Logs all requests for debugging and monitoring
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // Dev: concise, colored logs
} else {
  app.use(
    morgan("combined", {
      stream: { write: (message) => logger.info(message.trim()) },
    })
  );
}

// Custom logger: Logs every incoming request (method, path, IP, User-Agent)
app.use((req, res, next) => {
  logger.info(
    `${req.method} ${req.path} - IP: ${req.ip} - User-Agent: ${req.get(
      "User-Agent"
    )}`
  );
  next();
});

// =============================
// API Routes
// =============================
// Why: Modularizes all API endpoints under /api for maintainability
const apiRoutes = require("./src/routes/route");
app.use("/api", apiRoutes);

// =============================
// Health Check Endpoint
// =============================
// Why: Provides a simple endpoint to check server and DB status
const healthRoutes = require("./src/routes/healthRoutes");
app.use("/health", healthRoutes);

// =============================
// Root Info Endpoint
// =============================
// Why: Welcome/info endpoint for quick API check
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to Invento API",
    version: "1.0.0",
    docs: `${req.protocol}://${req.get("host")}/api/docs`,
  });
});

// =============================
// Error Handling Middlewares
// =============================
// Why: Catches 404s and all thrown errors for consistent API responses
app.use(notFound); // Handles 404 routes
app.use(errorHandler); // Handles thrown errors centrally

// =============================
// Start Server & Connect DB
// =============================
// Why: Ensures DB is connected, models are synced, and server is robust to errors
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Ensure DB connection first (MySQL pool)
    await connectDB();
    logger.info("✅ Database connected successfully");
    // Import models to sync
    require("./src/models/index");

    // Sync Sequelize models (auto-migrate schema)
    await sequelize.sync({ alter: true });
    logger.info("✅ Sequelize models synced");

    // Start Express server
    const server = app.listen(PORT, "0.0.0.0", () => {
      logger.info(
        `🚀 Invento API running in ${process.env.NODE_ENV} on port ${PORT}`
      );
    });

    // Graceful Shutdown: Ensures clean exit on SIGTERM/SIGINT
    const shutdown = () => {
      logger.info("Received shutdown signal, closing server...");
      server.close(() => {
        logger.info("HTTP server closed");
        disconnectDB();
        process.exit(0);
      });
      setTimeout(() => {
        logger.error("Force shutting down...");
        process.exit(1);
      }, 10000);
    };
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);

    // Handle Uncaught Errors: Prevents server from hanging on fatal errors
    process.on("unhandledRejection", (err) => {
      logger.error("UNHANDLED REJECTION 💥", err.message);
      shutdown();
    });
    process.on("uncaughtException", (err) => {
      logger.error("UNCAUGHT EXCEPTION 💥", err.message);
      shutdown();
    });
  } catch (err) {
    logger.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;

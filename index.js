/**
 * =====================================================
 * Invento API Server - Entry Point
 * Node.js + Express + MySQL backend for React (Vite)
 * Includes security, logging, validation & error handling
 * =====================================================
 */

/* -------------------- Load Environment Variables -------------------- */
require("dotenv").config(); // Loads variables from .env file into process.env

/* -------------------- Core & Security Middleware -------------------- */
const express = require("express"); // Web framework for handling HTTP requests
const cors = require("cors"); // Enables cross-origin requests (needed for frontend)
const helmet = require("helmet"); // Sets various HTTP headers to secure app
const rateLimit = require("express-rate-limit"); // Limits repeated requests from same IP
const compression = require("compression"); // Compresses response bodies to improve speed
const sanitize = require("./src/middleware/sanitize"); // Sanitizes user input from XSS attacks
const hpp = require("hpp"); // Prevents HTTP parameter pollution
const morgan = require("morgan"); // Logs HTTP requests in console
const sequelize = require("./src/config/sequelize"); // Sequelize instance
/* -------------------- Custom Utilities -------------------- */
const { connectDB, disconnectDB, getPool } = require("./src/config/db"); // DB connection
const logger = require("./src/utils/logger"); // Custom logger (Winston or similar)
const { errorHandler, notFound } = require("./src/middleware/errorMiddleware"); // Custom error middleware

// models initilize here
// const User = require("./src/models/users");
const User = require("./src/models/users");

/* -------------------- Initialize App -------------------- */
const app = express();

/* -------------------- Set Trust Proxy (for req.ip behind proxies) -------------------- */
app.set("trust proxy", 1);

/* -------------------- Helmet Security -------------------- */
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

/* -------------------- CORS Configuration -------------------- */
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

/* -------------------- Rate Limiting -------------------- */
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

/* -------------------- Other Security Middlewares -------------------- */
app.use(sanitize); // Clean user input from malicious HTML/JS
app.use(
  hpp({
    whitelist: ["sort", "page", "limit", "fields", "search"], // allowed query params
  })
);

/* -------------------- Body Parsing & Compression -------------------- */
app.use(express.json({ limit: "20kb" })); // Parse JSON with 20kb limit
app.use(express.urlencoded({ extended: true, limit: "20kb" })); // Parse form data
app.use(compression()); // Gzip compression

/* -------------------- Request Logging -------------------- */
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // Colored concise logs for dev
} else {
  app.use(
    morgan("combined", {
      stream: { write: (message) => logger.info(message.trim()) },
    })
  );
}

// Custom logger: Logs every incoming request (method, path, IP)
app.use((req, res, next) => {
  logger.info(
    `${req.method} ${req.path} - IP: ${req.ip} - User-Agent: ${req.get(
      "User-Agent"
    )}`
  );
  next();
});

/* -------------------- API Routes -------------------- */
const apiRoutes = require("./src/routes/route"); // All API endpoints
app.use("/api", apiRoutes);

/* -------------------- Health Check Endpoint -------------------- */
const healthRoutes = require("./src/routes/healthRoutes");
app.use("/health", healthRoutes);

/* -------------------- Root Info Endpoint -------------------- */
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to Invento API",
    version: "1.0.0",
    docs: `${req.protocol}://${req.get("host")}/api/docs`,
  });
});

/* -------------------- Error Handling Middlewares -------------------- */
app.use(notFound); // Handles 404 routes

// app.use(errors());

app.use(errorHandler); // Handles thrown errors centrally

/* -------------------- Start Server & Connect DB -------------------- */
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB(); // your MySQL pool connection (if still needed)
    logger.info("✅ Database connected successfully");

    // 🔹 Sync Sequelize models (creates tables if not exist)
    await sequelize.sync({ alter: true });
    logger.info("✅ Sequelize models synced");

    const server = app.listen(PORT, "0.0.0.0", () => {
      logger.info(
        `🚀 Invento API running in ${process.env.NODE_ENV} on port ${PORT}`
      );
    });

    /* Graceful Shutdown */
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

    // Handle Uncaught Errors
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

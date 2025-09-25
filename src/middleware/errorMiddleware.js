// =============================
// Error Middleware
// =============================
// Why: Centralizes error handling for all routes and controllers
// Benefit: Consistent error responses, easier debugging, and better security

const logger = require("../utils/logger"); // Custom logger for error logging
const { isCelebrateError } = require("celebrate"); // Used for Joi validation error handling

/**
 * notFound Middleware
 * Why: Handles requests to undefined routes (404)
 * Benefit: Ensures client gets a clear 404 error for unknown endpoints
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/**
 * errorHandler Middleware
 * Why: Handles all errors thrown in routes/controllers (including validation)
 * Benefit: Sends consistent error responses, logs details, and hides stack in production
 */
const errorHandler = (err, req, res, next) => {
  // Handle Celebrate (Joi) Validation Errors
  if (isCelebrateError(err)) {
    const errors = [];
    for (const [, joiError] of err.details.entries()) {
      for (const detail of joiError.details) {
        errors.push({
          field: detail.context?.key || detail.path.join("."),
          message: detail.message.replace(/[\"]+/g, ""), // remove Joi quotes
        });
      }
    }
    logger.warn(
      `Validation failed on ${req.method} ${req.originalUrl} → ${errors
        .map((e) => `${e.field}: ${e.message}`)
        .join(" | ")}`
    );
    return res.status(400).json({
      status: "fail",
      message: "Validation failed",
      errors,
    });
  }

  // Handle All Other Errors
  const statusCode = err.statusCode || 500;
  logger.error(
    `${req.method} ${req.originalUrl} - ${err.message}\n${
      err.stack && process.env.NODE_ENV === "development" ? err.stack : ""
    }`
  );
  return res.status(statusCode).json({
    status: "error",
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// Export middlewares for use in main app
module.exports = { notFound, errorHandler };

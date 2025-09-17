const logger = require("../utils/logger");
const { isCelebrateError } = require("celebrate");

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (err, req, res, next) => {
  /* -------------------------
   * Handle Celebrate Validation Errors
   * ------------------------- */
  if (isCelebrateError(err)) {
    const errors = [];

    for (const [, joiError] of err.details.entries()) {
      for (const detail of joiError.details) {
        errors.push({
          field: detail.context?.key || detail.path.join("."),
          message: detail.message.replace(/["]/g, ""), // remove Joi quotes
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

  /* -------------------------
   * Handle Other Errors
   * ------------------------- */
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

module.exports = { notFound, errorHandler };

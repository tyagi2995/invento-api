const Joi = require("joi");

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const fieldErrors = {};
      error.details.forEach((err) => {
        const field = err.path.join(".");
        fieldErrors[field] = err.message;
      });

      return res.status(200).json({
        status: "false",
        message: "Validation failed",
        errors: fieldErrors,
      });
    }
    next();
  };
};

module.exports = validate;

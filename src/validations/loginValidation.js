const { celebrate, Joi, Segments } = require("celebrate");

exports.loginValidator = celebrate({
  [Segments.BODY]: Joi.object()
    .keys({
      email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Please enter a valid email address",
        "any.required": "Email is required",
      }),
      password: Joi.string().min(6).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters long",
        "any.required": "Password is required",
      }),
    })
    .options({ abortEarly: false }), // <--- this is important
});

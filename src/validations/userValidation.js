const { Joi, Segments } = require("celebrate");

const userValidation = {
  create: {
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(3).max(50).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    }),
  },
  update: {
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(3).max(50),
      email: Joi.string().email(),
    }),
  },
};

module.exports = userValidation;

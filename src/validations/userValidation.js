const { celebrate, Joi, Segments } = require("celebrate");

/**
 * =================================================
 * @module User Validations
 * =================================================
 * Centralized celebrate/Joi validators for user routes
 */

exports.createUserValidator = celebrate({
  [Segments.BODY]: Joi.object({
    username: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(6).required(),
    role_id: Joi.number().integer().required(),
    office_id: Joi.number().integer().optional(),
    employee_id: Joi.number().integer().optional(),
  }),
});

exports.getUserValidator = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.number().integer().required(),
  }),
});

exports.updateUserValidator = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.number().integer().required(),
  }),
  [Segments.BODY]: Joi.object({
    username: Joi.string().min(3).max(50).optional(),
    password: Joi.string().min(6).optional(),
    role_id: Joi.number().integer().optional(),
    office_id: Joi.number().integer().optional(),
    employee_id: Joi.number().integer().optional(),
  }),
});

exports.deleteUserValidator = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.number().integer().required(),
  }),
});

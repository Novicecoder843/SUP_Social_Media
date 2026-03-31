const Joi = require("joi");

const passwordValidation = (value, helpers) => {

  if (!/\d/.test(value)) {
    return helpers.message("Password must contain a number");
  }

  if (!/[A-Z]/.test(value)) {
    return helpers.message("Password must contain uppercase letter");
  }

  return value;
};

exports.registerSchema = Joi.object({
  email: Joi.string().email().required(),

  password: Joi.string()
    .min(6)
    .required()
    .custom(passwordValidation),
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

exports.refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

exports.forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

exports.resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).required(),
});
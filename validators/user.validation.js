const Joi = require("joi");

const usernameValidation = (value, helpers) => {

  if (value.includes("admin")) {
    return helpers.message("Username cannot contain 'admin'");
  }

  if (value !== value.toLowerCase()) {
    return helpers.message("Username must be lowercase");
  }

  return value;
};

exports.updateProfileSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(50)
    .required()
    .custom(usernameValidation),

  bio: Joi.string().allow("").max(200),

  profile_image: Joi.string().uri().allow(""),
});
const Joi = require("joi");

const signUpSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(3).max(20).alphanum().required(),
  foodPreferences: Joi.array().items(Joi.number()).min(1)
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(3).max(20).required(),
});

module.exports = {
  signUpSchema,
  loginSchema
};

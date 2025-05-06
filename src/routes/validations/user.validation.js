const Joi = require("joi");

const signUpSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(3).max(20).alphanum().required(),
  foodPreferences: Joi.when("role", {
    is: "usuario_consumidor",
    then: Joi.array().items(Joi.number().valid(1, 2, 3)).min(1).required(),
    otherwise: Joi.forbidden()
  }),

  role: Joi.string().valid("admin", "usuario_consumidor", "usuario_restaurant", "usuario_vendedor")
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(3).max(20).required(),
});

module.exports = {
  signUpSchema,
  loginSchema
};

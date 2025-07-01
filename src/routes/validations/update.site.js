const Joi = require("joi");

const updateSiteSchema = Joi.object({
  name: Joi.string().min(3).max(40),
  country: Joi.string().min(3).max(20),
  state: Joi.string().min(3).max(20),
  city: Joi.string().min(3).max(20),
  address: Joi.string().min(3).max(50),
  description: Joi.string().min(10).max(300),
  type: Joi.number().valid(1, 2),
  reviews: Joi.array().items(Joi.string()),
  latitude: Joi.number(),
  longitude: Joi.number(),
  foodPreferences: Joi.array().items(Joi.number().valid(1, 2, 3)).min(1).required(),
  price: Joi.number().valid(1, 2, 3),
  tag: Joi.string().min(3).max(20)
});

module.exports = updateSiteSchema;

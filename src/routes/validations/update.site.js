const Joi = require("joi");

const updateSiteSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  country: Joi.string().min(3).max(20),
  state: Joi.string().min(3).max(20),
  city: Joi.string().min(3).max(20),
  address: Joi.string().min(3).max(50),
  description: Joi.string().min(10).max(300),
  type: Joi.number().valid(1, 2), //// 1 = Restaurante y 2 = Comercio solo para comprar 
  reviews: Joi.array().items(Joi.string()),
  latitude: Joi.number(),
  longitude: Joi.number()
});

module.exports = updateSiteSchema;

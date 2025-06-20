const Joi = require("joi");

const siteSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  country: Joi.string().min(3).max(20).required(),
  state: Joi.string().min(3).max(20).required(),
  city: Joi.string().min(3).max(20).required(),
  address: Joi.string().min(3).max(50).required(),
  description: Joi.string().required().min(10).max(300),
  type: Joi.number().valid(1, 2).required(), //// 1 = Restaurante y 2 = Comercio solo para comprar 
  reviews: Joi.array().items(Joi.string()),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  images: Joi.array().items(Joi.string())
});

module.exports = siteSchema;

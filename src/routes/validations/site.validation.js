const Joi = require("joi");

const siteSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  country: Joi.string().min(3).max(100).required(),
  state: Joi.string().min(3).max(100).required(),
  city: Joi.string().min(3).max(100).required(),
  address: Joi.string().min(3).max(100).required(),
  description: Joi.string().required().min(10).max(300),
  type: Joi.number().valid(1, 2).required(), //// 1 = Restaurante y 2 = Comercio solo para comprar 
  reviews: Joi.array().items(Joi.string()),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  images: Joi.array().items(Joi.string()),
  foodPreferences: Joi.array().items(Joi.number().valid(1, 2, 3)).min(1).required(),
  price: Joi.number().valid(1, 2, 3), 
  tag: Joi.string().min(3).max(20)
});

module.exports = siteSchema;

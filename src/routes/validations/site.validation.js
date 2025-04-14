const Joi = require("joi");

// name, country, state, city, address, latitude, longitude, desciption
const siteSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  country: Joi.string().min(3).max(20).required(),
  state: Joi.string().min(3).max(20).required(),
  city: Joi.string().min(3).max(20).required(),
  address: Joi.string().min(3).max(50).required(),
  description: Joi.string().required().min(10).max(300),
  type: Joi.number().required(),
  reviews: Joi.array().items(Joi.string()),
  latitude: Joi.number().required(),
  longitude: Joi.number().required()
});

module.exports = siteSchema;

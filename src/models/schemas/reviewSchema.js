const Joi = require("joi");

// name, country, state, city, address, latitude, longitude, desciption
const reviewSchema = Joi.object({
  comment: Joi.string().min(3).max(100).required(),
  stars: Joi.number().integer().min(1).max(5).required()
  // userId: Joi.number().required()
});

module.exports = {reviewSchema};
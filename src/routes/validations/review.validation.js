const Joi = require("joi");

const reviewSchema = Joi.object({
  comment: Joi.string().min(3).max(300).required(),
  stars: Joi.number().integer().min(1).max(5).required(),
  security: Joi.number().integer().min(1).max(5).required(),
  images: Joi.array().items(Joi.string())
});

module.exports = { reviewSchema };
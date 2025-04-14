const Joi = require("joi");

const reviewSchema = Joi.object({
  comment: Joi.string().min(3).max(100).required(),
  stars: Joi.number().integer().min(1).max(5).required()
});

module.exports = {reviewSchema};
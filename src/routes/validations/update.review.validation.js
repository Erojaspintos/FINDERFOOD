const Joi = require("joi");

const updateReviewSchema = Joi.object({
  comment: Joi.string().min(3).max(300),
  stars: Joi.number().integer().min(1).max(5),
  security: Joi.number().integer().min(1).max(5),
  images: Joi.array().items(Joi.string())
}).or("comment", "stars"); // al menos uno de los dos es obligatorio

module.exports = { updateReviewSchema };
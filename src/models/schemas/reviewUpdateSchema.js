const Joi = require("joi");

const updateReviewSchema = Joi.object({
  comment: Joi.string().optional(),
  stars: Joi.number().min(1).max(5).optional(),
    images: {
    type: String,
    default: []
  }
});

module.exports = { updateReviewSchema };

const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  comment: { type: String, required: true },
  stars: { type: Number, required: true, min: 1, max: 5 },
  creationDate: { type: Date, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
  },
  images: {
    type: [String],
    default: []
  }
});

module.exports = reviewSchema;

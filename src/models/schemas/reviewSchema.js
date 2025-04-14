const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  comment: { type: String, required: true },
  stars: { type: Number, required: true, min: 1, max: 5 },
  creationDate: { type: Date, required: true },
  userId: { type: Number, required: true }
});

module.exports = reviewSchema;

const mongoose = require("mongoose");
const reviewSchema = require("../schemas/reviewSchema");
const siteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String },
  description: { type: String, required: true },
  type: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tag: { type: String },
  price: { type: Number, enum: [1, 2, 3] },

  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  reviews: {
    type: [reviewSchema],
    default: []
  },
  images: {
    type: [String],
    default: []
  },
  foodPreferences: {
    type: [Number],
    default: []
  }
});

siteSchema.index({ location: '2dsphere' });

module.exports = siteSchema;

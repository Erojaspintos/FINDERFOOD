const mongoose = require("mongoose");
const reviewSchema = require("../models/schemas/reviewSchema");

const Review = mongoose.model("Review", reviewSchema); 

module.exports = Review;
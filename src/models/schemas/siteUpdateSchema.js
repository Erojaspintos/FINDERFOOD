const mongoose = require("mongoose");
const reviewSchema = require("../schemas/reviewSchema");

const siteUpdateSchema = new mongoose.Schema({
    name: { type: String },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    address: { type: String },
    description: { type: String },
    type: { type: Number },
    latitude: { type: Number },
    longitude: { type: Number },
    reviews: {
        type: [reviewSchema], default: []
    }
});

module.exports = siteUpdateSchema;
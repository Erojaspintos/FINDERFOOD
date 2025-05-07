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
    reviews: {
        type: [reviewSchema], default: []
    },
    // agregamos este campo para busquedas geoespaciales
    location: {
        type: {
            type: String, 
            enum: ['Point'],
        },
        coordinates: {
            type: [Number], // [longitud, latitud]
        }
    },
});

module.exports = siteUpdateSchema;
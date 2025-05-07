const mongoose = require("mongoose");
const reviewSchema = require("../schemas/reviewSchema");
const siteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String },
  description: { type: String, required: true },
  type: { type: Number, required: true }, // 1 lugar donde ir a comer, 2 lugar donde ir a comprar
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // Agregás este campo para búsquedas geoespaciales
  location: {
    type: {
      type: String, // "Point"
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitud, latitud]
      required: true
    }
  },

  // reviews
  reviews: {
    type: [reviewSchema],
    default: []
  }
});

// 💡 Este es el índice geoespacial obligatorio
siteSchema.index({ location: '2dsphere' });


module.exports = siteSchema;

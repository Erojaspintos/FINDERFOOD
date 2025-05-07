const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  foodPreferences: { type: [Number], required: true },
  role: {
    type: String,
    enum: ["admin", "usuario_consumidor", "usuario_restaurant", "usuario_vendedor"],
    default: "usuario_consumidor",
    required: true
  }
});

module.exports = userSchema;
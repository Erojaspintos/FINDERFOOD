const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true},
  email: { type: String, required: true, unique: true}
})
//siteId{type: mongoose.Shchema.ObjectId, ref "Site", required: true} //esto es si quisieramos ponerle una referencia a un objeto en otra tabla, seguramente eso este en reseñas o otra

module.exports = userSchema;
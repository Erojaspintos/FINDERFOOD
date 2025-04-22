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


// "admin"               - acceso total a todo el sistema, puede hacer casi todo: ver, borrar, editar sitios, eliminar/ocultar resenas ,usuarios menos editar resenas 
// "usuario_consumidor"  - busca sites, crear sites, dejar resenas, editar y eliminar sus propias resenas pero no las de otros 
// "usuario_restaurant"  - crea su site, edita y borra su site pero no puede dejar resenas 
// "usuario_vendedor"    - crea su site, edita y borra pero no puede dejar resenas


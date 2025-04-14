const mongoose = require("mongoose");
const siteSchema = require("../models/schemas/siteSchema");

const Site = mongoose.model("Site", siteSchema); 

module.exports = Site;
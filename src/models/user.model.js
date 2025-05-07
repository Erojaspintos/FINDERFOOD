const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const userSchema = require("../models/schemas/userSchema");

const User = mongoose.model("User", userSchema); 

module.exports = User;
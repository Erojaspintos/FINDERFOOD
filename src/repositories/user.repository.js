const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

const getAll = async () => {
    return await User.find();
}

const findUser = async (email) => {
    return await User.findOne({email : email});
}

const saveUser = async (name, email, password,foodPreferences) => {
    const hashedPassword = await bcrypt.hash(password, 10);
   console.log("HOA"+foodPreferences)
    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
      foodPreferences: foodPreferences
    });
    const res = await newUser.save();
    return res;
  };

const isValidPassword = async (password, userPassword) => {
    const result = await bcrypt.compare(password, userPassword);
    return result;
};

module.exports = {
    getAll,
    findUser,
    saveUser,
    isValidPassword
};
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

const getAll = async () => {
    console.log("getall")
    return await User.find();
}

const findUser = async (email) => {
    return await User.findOne({email: email});
}

const isValidPassword = async (password, userPassword) => {
    const result = await bcrypt.compare(password, userPassword);
    return result;
};

module.exports = {
    getAll,
    findUser,
    isValidPassword
};
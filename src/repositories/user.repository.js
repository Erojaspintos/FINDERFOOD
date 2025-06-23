const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

const getAll = async () => {
    return await User.find();
}

const findUser = async (email) => {s
    return await User.findOne({ email: email });
}

const saveUser = async (name, email, password, foodPreferences, role) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        name: name,
        email: email,
        password: hashedPassword,
        foodPreferences: foodPreferences,
        role: role,
    });
    const res = await newUser.save();
    return res;
};

const isValidPassword = async (password, userPassword) => {
    const result = await bcrypt.compare(password, userPassword);
    return result;
};

const getUsersNames = async (ids) => {
    console.log('ids '+ids)
    return await User.find({ _id: { $in: ids } });
}

module.exports = {
    getAll,
    findUser,
    saveUser,
    isValidPassword,
    getUsersNames
};
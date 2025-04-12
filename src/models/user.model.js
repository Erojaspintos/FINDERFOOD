const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const userSchema = require("../models/schemas/userSchema");

const User = mongoose.model("User", userSchema); 

module.exports =  User;
/*
const users = [
  {
    id: 1,
    name: "Emi",
    email: "emilia@gmail.com",
    password: "$2b$10$/zTrzo6FkH4Oe/ByYLPhtuif6gGaWlq9oeE7QymbQJDBTM985iqCC",
    foodPreferences: 1,
    active: true,
  },
  {
    id: 2,
    name: "Eze",
    email: "ezequiel",
    password: "$2b$10$xktwrrsGh1pGfvWSYIJY5OqlOcqvJtF7n6b.f9TLwkocnKIf1meJa",
    foodPreferences: 1,
    active: true,
  },
];

const getUsers = () => users;

const findUser = (name) => {
  const user = users.find((u) => u.name == name);
  return user;
};

const isValidPassword = async (password, userPassword) => {
  

  const result = await bcrypt.compare(password, userPassword);
  return result;
};

const findUserByEmail = (email) => {
  const user = users.find((u) => u.email == email);
  return user;
};

const saveUser = async (name, email, password, foodPreferences) => {
  const lastUser = users[users.length - 1];
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    name: name,
    email: email,
    foodPreferences: foodPreferences,
    password: hashedPassword,
    active: true,
  };
  if (lastUser) {
    newUser.id = lastUser.id + 1;
  } else {
    newUser.id = 1;
  }
  users.push(newUser);
  return newUser.id;
};
*/


//module.exports = { saveUser, findUser, findUserByEmail, isValidPassword, getUsers };
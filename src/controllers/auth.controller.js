const jwt = require("jsonwebtoken");
const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY;

const User = require("../models/user.model");

const getUsersController = (req, res) => {
    res.status(200).json(getUsers());
  };

const postAuthLogin = async (req, res) => {
  console.log("hola");
    const { body } = req;
    const { email, password } = body;
    const user = await User.findOne({email: email, password : password})

    console.log(user);

    if (!user) {
        res.status(400).json({ message: "Credenciales inválidas" });
        return;
    }
    const isValidPass = await isValidPassword(password, user.password);
    if (!isValidPass) {
        res.status(401).json({ message: "Credenciales inválidas" });
        return;
    }

    const token = jwt.sign(
      {id: user.id, email: user.email},
      AUTH_SECRET_KEY,
      {
        expiresIn: "1h"
      }
    );

    res.json({ token: token });
};

const postAuthSignUp = async (req, res) => {
    const { body } = req;
    const { name, email, password, foodPreferences } = body;
    if (findUserByEmail(email)) {
      res.status(400).json({ message: "Email de usuario ya en uso" });
      return;
    }
    const userID = await saveUser(name, email, password, foodPreferences);
    res.status(201).json({ message: "Usuario creado exitosamente", id: userID });
  };

module.exports = { postAuthLogin, postAuthSignUp, getUsersController };
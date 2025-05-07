const jwt = require("jsonwebtoken");

const { getAll,
  findUser,
  isValidPassword,
  saveUser } = require("../repositories/user.repository");
const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY;

const getUsersController = async (req, res) => {
  try {
    const users = await getAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios: " + error });
  }
};

const postAuthLogin = async (req, res) => {
  const { body } = req;
  const { email, password } = body;
  const user = await findUser(email)

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
    { id: user.id, email: user.email, role: user.role },
    AUTH_SECRET_KEY,
    {
      expiresIn: "1h"
    }
  );

  res.json({ token: token });
};

const postAuthSignUp = async (req, res) => {
  const { body } = req;
  const { name, email, password, foodPreferences, role } = body;

  const user = await findUser(email);
  if (user) {
    res.status(400).json({ message: "Email de usuario ya en uso" });
    return;
  }
  try {
    await saveUser(name, email, password, foodPreferences, role);
    res.status(201).json({ message: "Usuario creado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Ha ocurrido un error registrando el usuario" });
  }
};

module.exports = { postAuthLogin, postAuthSignUp, getUsersController};
const { getUsersNames } = require("../repositories/user.repository");

const healthController = (req, res) => {
  res.status(200).send("OK");
};

const pingController = (req, res) => {
  res.status(200).send("pong");
};

const getUsersNamesController = async (req, res) => {
  const filter = req.query;
  
  try {
    const users = await getUsersNames(filter.ids);
    res.status(200).json({
      message: "Nombres de usuarios",
      data: users.map(user => ({
        _id: user._id,
        name: user.name
      }))
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios: " + error });
  }
}

module.exports = {
  healthController,
  pingController,
  getUsersNamesController
};

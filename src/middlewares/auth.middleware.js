const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY;

const authMiddleWare = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    logger.sentryError({ message: "Unauthorized - No token provided" });
    return res
      .status(401)
      .json({ message: "Unauthorized - No token provided" });
  }

  try {
    const verified = jwt.verify(token, AUTH_SECRET_KEY);
    req.user = verified;
    next();
  } catch (error) {
    logger.sentryError({ message: "Token inválido" });
    res.status(403).json({ message: "Token inválido" });
  }
};

module.exports = authMiddleWare;

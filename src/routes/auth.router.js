const express = require("express");
const authRouter = express.Router();
const payloadMiddleWare = require("../middlewares/payload.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

const {
    postAuthLogin,
    postAuthSignUp,
    getUsersController,
} = require("../controllers/auth.controller");

const { loginSchema, signUpSchema } = require("./validations/user.validation");

authRouter.post("/signup", payloadMiddleWare(signUpSchema), postAuthSignUp);
authRouter.post("/login", payloadMiddleWare(loginSchema), postAuthLogin);
authRouter.get("/users", authMiddleware, roleMiddleware("admin"), getUsersController);

module.exports = authRouter;
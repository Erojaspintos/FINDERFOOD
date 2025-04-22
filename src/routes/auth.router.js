const express = require("express");
const authRouter = express.Router();
const payloadMiddleWare = require("../middlewares/paylod.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

const {
    postAuthLogin,
    postAuthSignUp,
    getUsersController,
} = require("../controllers/auth.controller");

const { loginSchema, signUpSchema } = require("./validations/user.validation");

authRouter.get("/users", authMiddleware, roleMiddleware("admin"), getUsersController);
authRouter.post("/login", payloadMiddleWare(loginSchema), postAuthLogin);
authRouter.post("/signup", payloadMiddleWare(signUpSchema), postAuthSignUp);

module.exports = authRouter;
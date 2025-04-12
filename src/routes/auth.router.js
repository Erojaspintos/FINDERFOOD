const express = require("express");
const authRouter = express.Router();
const payloadMiddleWare = require("../middlewares/paylod.middleware");

const {
    postAuthLogin,
    postAuthSignUp,
    getUsersController,
} = require("../controllers/auth.controller");

const userSchema = require("../models/schemas/userSchema");

authRouter.get("/users", getUsersController);
authRouter.post("/login", payloadMiddleWare(userSchema), postAuthLogin);
authRouter.post("/signup", payloadMiddleWare(userSchema), postAuthSignUp);


module.exports = authRouter;
const express = require("express");
const publicRouter = express.Router();

const {
  healthController,
  pingController,
  getUsersNamesController
} = require("../controllers/public.controller");

const {
  getSitesController,
  getSiteController
} = require("../controllers/sites.controller");

publicRouter.get("/health", healthController);
publicRouter.get("/ping", pingController);
publicRouter.get("/sites", getSitesController);
publicRouter.get("/sites/:id", getSiteController);
publicRouter.get("/usersNames", getUsersNamesController);

module.exports = publicRouter;

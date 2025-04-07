const express = require("express");
const router = express.Router();

const {
  getTodosController,
  getTodoController,
  postTodoController,
  deleteTodoController,
  putTodoController,
} = require("../controllers/todos.controller");

//OBLIGATORIO 
const {
  getSitesController,
  getSiteController,
  postSiteController,
  putSiteController,
  deleteSiteController,
  deleteReviewController,
  postReviewSiteController
} = require("../controllers/sites.controller");

const siteSchema = require("../models/schemas/siteSchema");
const {reviewSchema} = require("../models/schemas/reviewSchema");
///////////////////////////////////////////////////

const payloadMiddleWare = require("../middlewares/paylod.middleware");
const sanitizeMiddleWare = require("../middlewares/sanitizer.middleware");
const { deleteReview } = require("../models/database");
const { required } = require("joi");

// Private Routes obligatorio
router.get("/sites", getSitesController);
router.get("/sites/:id", getSiteController);
router.delete("/sites/:id", deleteSiteController);
router.delete("/sites/:id/reviews", deleteReviewController);

router.post("/sites", payloadMiddleWare(siteSchema), postSiteController);
router.put("/sites/:id", payloadMiddleWare(siteSchema), putSiteController);

router.post("/sites/:id/reviews", payloadMiddleWare(reviewSchema), postReviewSiteController);

module.exports = router;
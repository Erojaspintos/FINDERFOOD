const express = require("express");
const router = express.Router();

//OBLIGATORIO 
const {
  getSitesController,
  getSiteController,
  postSiteController,
  putSiteController,
  deleteSiteController,
  deleteReviewController,
  postReviewSiteController,
  putReviewSiteController
} = require("../controllers/sites.controller");

const siteSchema = require("../routes/validations/site.validation");
const { reviewSchema } = require("../routes/validations/review.validation");
const { updateReviewSchema } = require("../routes/validations/update.review.validation");
///////////////////////////////////////////////////

const payloadMiddleWare = require("../middlewares/payload.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const siteUpdateSchema = require("../routes/validations/update.site");

// Private Routes obligatorio

//SITES
router.get("/sites", getSitesController);
router.get("/sites/:id", getSiteController);
router.post("/sites", roleMiddleware("usuario_restaurant", "usuario_vendedor", "usuario_consumidor"), payloadMiddleWare(siteSchema), postSiteController);
router.put("/sites/:id", payloadMiddleWare(siteUpdateSchema), putSiteController);
router.delete("/sites/:id", deleteSiteController);

//REVIEWS
router.post("/sites/:id/reviews", roleMiddleware("usuario_consumidor"), payloadMiddleWare(reviewSchema), postReviewSiteController);
router.put("/sites/:id/reviews/:reviewId", roleMiddleware("usuario_consumidor"), payloadMiddleWare(updateReviewSchema), putReviewSiteController);
router.delete("/sites/:id/reviews/:reviewId", roleMiddleware("usuario_consumidor", "admin"), deleteReviewController);

module.exports = router;
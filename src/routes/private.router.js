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
  postReviewSiteController
} = require("../controllers/sites.controller");

const siteSchema = require("../routes/validations/site.validation");
const {reviewSchema} = require("../routes/validations/review.validation");
///////////////////////////////////////////////////

const payloadMiddleWare = require("../middlewares/paylod.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const siteUpdateSchema = require("../models/schemas/siteUpdateSchema");


// Private Routes obligatorio
router.get("/sites", getSitesController);
router.get("/sites/:id", getSiteController);
router.delete("/sites/:id", deleteSiteController);
router.delete("/sites/:id/reviews", deleteReviewController);

router.post("/sites", roleMiddleware("usuario_restaurant", "usuario_vendedor"),payloadMiddleWare(siteSchema), postSiteController);
router.put("/sites/:id", payloadMiddleWare(siteUpdateSchema),putSiteController); //  SiteUpdateSchema con los mismos atributos pero sin required para poder modificar solo los que quiera

router.post("/sites/:id/reviews", roleMiddleware("usuario_consumidor"),payloadMiddleWare(reviewSchema), postReviewSiteController);

module.exports = router;
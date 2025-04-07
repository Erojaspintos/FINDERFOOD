const {
  getSites,
  findSiteById,
  createSite,
  updateSite,
  deleteSite,
  findReviewById,
  addReview,
  deleteReview
} = require("../models/database");
const { message } = require("../models/schemas/reviewSchema");

const getSitesController = (req, res) => {
  const filter = req.query;
  res.status(200).json(getSites(filter));
};

const getSiteController = (req, res) => {
  const siteId = req.params.id;
  const site = findSiteById(siteId);
  if (site) {
    res.status(200).json(site);
    return;
  }
  res.status(404).json({
    message: `No se ha el site con id: ${siteId}`,
  });
}

const postSiteController = async (req, res) => {
  const { body } = req;
  createSite(body);
  res.status(201).json({
    message: "Sitio creado correctamente",
  });
};

const putSiteController = (req, res) => {

  const siteId = req.params.id;
  const { body } = req;

  console.log("Buscando id:", siteId); //borrar
  let site = findSiteById(siteId);
  if (site) {
    site = updateSite(siteId, body);
    res.status(200).json(site);
    return;
  }

  res.status(404).json({
    message: `No se ha encontrado el sitio con id: ${siteId}.`,
  });
}

const deleteSiteController = (req, res) => {
  const siteId = req.params.id;
  deleteSite(siteId);
  res.status(200).json({
    message: "Sitio eliminado correctamente",
  });
}

const deleteReviewController = (req, res) => {
  const siteId = req.params.id;
  const reviewId = req.body.reviewId;
  const site = findSiteById(siteId);
  if (site == null) {
    res.status(404).json({
      message: `No se ha encontrado el sitio con id: ${siteId}.`,
    });

    return;
  }
  else {
    const review = findReviewById(site, reviewId);

    if (review == null) {
      res.status(404).json({
        message: `No se ha encontrado la reseña con id: ${siteId}.`,
      });

      return;
    }
    else {
      if (review.userId != req.user.id) {
        res.status(401).json({
          message: `No tiene autorización para eliminar la reseña ${reviewId}.`,
        });
        return;
      }

      deleteReview(siteId, reviewId);

      res.status(200).json({
        message: "Resena eliminada correctamente",
      });
    }
  }
}

const postReviewSiteController = (req, res) => {
  const siteId = req.params.id;
  const reviewData = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: `No autenticado` });
  }

  const site = findSiteById(siteId);
  if (!site) {
    return res.status(404).json({
      message: `El sitio con id: ${siteId} no fue encontrado.`,
    });
  }

  const createdReview = addReview(siteId, reviewData, userId);
  if (!createdReview) {
    return res.status(400).json({
      message: `El usuario ${userId} ya ingreso una resena para este lugar.`
    });
  }

  res.status(200).json(createdReview);
};

module.exports = {
  getSitesController,
  getSiteController,
  postSiteController,
  putSiteController,
  deleteSiteController,
  deleteReviewController,
  postReviewSiteController
};
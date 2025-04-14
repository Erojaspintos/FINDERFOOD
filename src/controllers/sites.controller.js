const {
  updateSite,
  deleteSite,
  findReviewById,
  deleteReview
} = require("../models/database");

const { getSites,
  getSiteById,
  addReview,
  createSite } = require("../repositories/site.repository");

const getSitesController = async (req, res) => {
  const filter = req.query;
  try {
    const sites = await getSites(filter);
    res.status(200).json(sites);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los Sitios: " + error });
  }
};

const getSiteController = async (req, res) => {
  const siteId = req.params.id;
  try {
    const site = await getSiteById(siteId);
    res.status(200).json(site);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los sitios: " + error });
  }
}

const postSiteController = async (req, res) => {
  const { body } = req;
  const { id } = req.user;

  try {
    await createSite(body, id);
    res.status(201).json({
      message: "Sitio creado correctamente",
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el sitio: " + error });
  }
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

const postReviewSiteController = async (req, res) => {
  const siteId = req.params.id;
  const reviewData = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: `No autenticado` });
  }

  const site = await getSiteById(siteId);
  if (!site) {
    return res.status(404).json({
      message: `El sitio con id: ${siteId} no fue encontrado.`,
    });
  }

  try {
    const createdReview = await addReview(site.id, reviewData, userId);

    res.status(200).json(createdReview);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la reseña: " + error });
  };
}

module.exports = {
  getSitesController,
  getSiteController,
  postSiteController,
  putSiteController,
  deleteSiteController,
  deleteReviewController,
  postReviewSiteController
};
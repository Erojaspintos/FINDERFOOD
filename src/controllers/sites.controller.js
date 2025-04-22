const { getSites,
  getSiteById,
  addReview,
  createSite,
  deleteSite,
  updateSite,
  deleteReview } = require("../repositories/site.repository");

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
    if (!site) {
      return res.status(404).json({ message: `Sitio con id ${siteId} no encontrado.` }); //cuando le pasas un id incorrecto entonces el sitio es null
    }
    res.status(200).json(site);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el sitio: " + error });
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

const putSiteController = async (req, res) => {

  const siteId = req.params.id;
  const { body } = req;

  try {
    const site = await updateSite(siteId, body);
    if (!site) {
      return res.status(404).json({ message: `Sitio con id ${siteId} no encontrado.` }); //mismo caso que el get del sitio null
    }
    res.status(200).json(site);
    return;
  } catch (error) {
    res.status(500).json({ message: "Error al modificar el sitio: " + error });
  }

}

const deleteSiteController = async (req, res) => {
  const siteId = req.params.id;
  //validar quien va a poder eliminar, yo creo que el usuario que lo creó o un usuario admin?
  try {
    const site = await deleteSite(siteId);
    console.log(site.body);
    if (!site) {
      return res.status(404).json({ message: `Sitio con id ${siteId} no encontrado.` }); // site null
    }
    res.status(200).json({
      message: "Sitio eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el sitio: " + error });
  }
}

const deleteReviewController = async (req, res) => {
  const siteId = req.params.id;
  const reviewId = req.body.reviewId;
  const userId = req.user.id;

  if (!userId) {
    return res.status(401).json({ message: "No autenticado." });
  }

  try {
    const site = await getSiteById(siteId);
    if (!site) {
      return res.status(404).json({ message: `Sitio con id ${siteId} no encontrado.` });
    }

    const review = site.reviews.id(reviewId);
    if (!review) {
      return res.status(404).json({ message: `Reseña con id ${reviewId} no encontrada.` });
    }

    if (review.userId.toString() !== userId) {
      return res.status(403).json({ message: "No tenés permiso para eliminar esta reseña. Unicamente quien la creo puede hacerlo" });
    }

    await deleteReview(siteId, reviewId);
    res.status(200).json({ message: "Reseña eliminada correctamente." });

  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la reseña: " + error.message });
  }
};

/* const deleteReviewController = async (req, res) => {
  const siteId = req.params.id;
  const reviewId = req.body.reviewId;

  try {
    await deleteReview(siteId, reviewId)
    res.status(200).json({ message: "Reseña eliminada correctamente." });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la reseña: " + error });
  }
} */

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

  const dejoReview = site.reviews.find(r => r.userId.toString() === userId);
  if (dejoReview) {
    return res.status(409).json({ message: "Usted ya realizo una reseña para este sitio." });
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
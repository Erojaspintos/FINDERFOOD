const { getSites,
  getSiteById,
  addReview,
  createSite,
  deleteSite,
  updateSite,
  deleteReview} = require("../repositories/site.repository");

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

const putSiteController = async (req, res) => {
  const siteId = req.params.id;
  const { body } = req;

  try {
    await updateSite(siteId, body);
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
    await deleteSite(siteId);
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
 
  try {
    await deleteReview(siteId, reviewId)
    res.status(200).json({message : "Reseña eliminada correctamente."});
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la reseña: " + error });
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
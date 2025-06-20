const jwt = require("jsonwebtoken");
const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY;
 
const { getSites,
  getSiteById,
  addReview,
  createSite,
  deleteSite,
  updateSite,
  deleteReview,
  updateSiteReview } = require("../repositories/site.repository");
 
const { cleanCache } = require("../services/redis.service");
 
const getSitesController = async (req, res) => {
  const filter = req.query;
  let userId = '0'; // por defecto público
 
  try {
    const token = req.headers["authorization"];
    if (token) {
      const verified = jwt.verify(token, AUTH_SECRET_KEY);
      userId = verified.id;
    }
 
    const sites = await getSites(filter, userId);
    res.status(200).json({
      message:"Lista de sitios encontrados",
      data: sites}
    );
  } catch (error) {
    console.error("Error en getSitesController:", error);
    res.status(500).json({ message: "Error al obtener los Sitios" });
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
    const sitioCreado = await createSite(body, id);
    await cleanCache(id);
 
    res.status(201).json({
      message: "Sitio creado correctamente",
      site: sitioCreado
    });
  } catch (error) {
 
    if (error.message.includes("SITE_ALREADY_EXISTS")) {
      return res.status(409).json({ message: "Ya existe un sitio con ese nombre y ubicación." });
    }
    res.status(500).json({ message: "Error al crear el sitio: " + error });
  }
};
 
const putSiteController = async (req, res) => {
  const siteId = req.params.id;
  const { body } = req;
  const { id } = req.user;
 
  try {
    const site = await updateSite(siteId, body);
    if (!site) {
      return res.status(404).json({ message: `Sitio con ID ${siteId} no encontrado.` });
    }
    res.status(200).json({ message: `Sitio con id ${siteId} actualizado correctamente.`, site: site });
    await cleanCache(id);
  }
  catch (error) {
    res.status(500).json({ message: error });
  }
}
 
const deleteSiteController = async (req, res) => {
  const siteId = req.params.id;
  const userId = req.user?.id;
  const userRole = req.user.role;
 
  try {
    await deleteSite(siteId, userId, userRole);
    await cleanCache(userId);
 
    res.status(200).json({
      message: "Sitio eliminado correctamente.",
    });
  }
  catch (error) {
    if (error.message == "SITE_NOT_EXIST") {
      return res.status(404).json({ message: "No existe un sitio con ese ID." });
    }
 
    if (error.message == "USER_NOT_CREATOR") {
      return res.status(403).json({ message: "Usted no tiene permiso para eliminar este sitio." });
    }
 
    if (error.message == "SITE_DELETE_FAILED") { //esto no pasa nunca
      return res.status(500).json({ message: "Error técnico al eliminar el sitio." });
    }
 
    return res.status(500).json({ message: error.message });
  }
};
 
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
    await cleanCache(userId);
    return res.status(200).json({
      message: "Reseña creada correctamente.",
      review: createdReview
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear la reseña: " + error.message });
  }
};
 
const putReviewSiteController = async (req, res) => {
  const siteId = req.params.id;
  const reviewId = req.params.reviewId;
  const { body } = req;
  const { id } = req.user;
 
  try {
    const review = await updateSiteReview(siteId, reviewId, body, id);
    await cleanCache(id);
 
    return res.status(200).json({
      message: `Reseña actualizada correctamente.`,
      review,
    });
  } catch (error) {
    if (error.message == "SITE_NOT_EXIST") {
      return res.status(404).json({ message: "Sitio no encontrado." });
    }
    if (error.message == "REVIEW_NOT_EXIST") {
      return res.status(404).json({ message: "Reseña no encontrada." });
    }
    if (error.message == "USER_NOT_CREATOR") {
      return res.status(403).json({ message: "No tenés permiso para modificar esta reseña. Solo el creador puede hacerlo." });
    }
 
    return res.status(500).json({ message: "Error al actualizar la reseña: " + error.message });
  }
};
 
const deleteReviewController = async (req, res) => {
  const siteId = req.params.id;
  const reviewId = req.params.reviewId;
  const userId = req.user.id;
  const userRole = req.user.role;
 
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
 
    //permite solo si es admin o si es el creador de la review
    const esAdmin = userRole === "admin";
    const esCreador = review.userId.toString() === userId;
 
    if (!esAdmin && !esCreador) {
      return res.status(403).json({
        message: "No tenés permiso para eliminar esta reseña.",
      });
    }
 
    await deleteReview(siteId, reviewId);
    await cleanCache(userId);
    res.status(200).json({ message: "Reseña eliminada correctamente." });
 
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la reseña: " + error.message });
  }
};
 
module.exports = {
  getSitesController,
  getSiteController,
  postSiteController,
  putSiteController,
  deleteSiteController,
  deleteReviewController,
  postReviewSiteController,
  putReviewSiteController
};
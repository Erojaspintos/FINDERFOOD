const Site = require("../models/site.model");
const dayjs = require("dayjs");

const getSiteById = async (id) => {
    /*aca usamos trycatch porque en el caso de que el FindOne no encuentre con el id que le pasamos, creimos que site se asignaba null pero al parecer no, 
    entonces nosotros para poder identificar esto queremos devolver null asi del otro lado notificar qeu el site no fue encontrado.
    */
    try {
        let site = await Site.findOne({ _id: id });
        console.log("site despues del findOne")
        return site;
        
    } catch (error) {
        console.log("no encontro el site")
        return null;
    }
}

const getSites = async (filter) => {
    return await Site.find(filter);
}

const createSite = async (model, userId) => {

    console.log(model);

    const newSite = new Site({
        name: model.name,
        country: model.country,
        state: model.state,
        city: model.city,
        address: model.address,
        description: model.description,
        type: model.type,
        userId: userId,
        latitude: model.latitude,
        longitude: model.longitude,
        reviews: []
    })
    await newSite.save();
}

const deleteSite = async (id, userId) => {
    await Site.deleteOne({ _id: id, userId: userId });
}

const addReview = async (siteId, model, userId) => {
    const creationDate = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const site = await getSiteById(siteId);

    if (!site) {
        throw new Error(`Sitio con id ${siteId} no encontrado.`);
    }

    const newReview = {
        comment: model.comment,
        stars: model.stars,
        userId: userId,
        creationDate: creationDate
    };

    site.reviews.push(newReview);
    await site.save(); 
    return site.reviews.at(-1);


  //  await Site.save(site);
}

const updateSite = async (siteId, model) => {
    const site = await getSiteById(siteId);
    if (site) {
        const updated = await Site.updateOne({ _id: siteId }, model);
        return { ...site.toObject(), ...model };
    } else {
        return null;
    }
};

const deleteReview = async (siteId, reviewId) => {
    const site = await getSiteById(siteId);
    if (site == null)
        throw new Error(`Sitio con id ${siteId} no encontrado.`);

    const review = site.reviews.id(reviewId); // o usar .find(...) como opción 2

    if (!review)
      throw new Error(`Review con id ${reviewId} no encontrada en el sitio ${siteId}.`);
  
    const result = await Site.updateOne(
        { _id: siteId },
        { $pull: { reviews: { _id: reviewId } } }
      );
    
      if (result.modifiedCount === 0) {
        throw new Error(`No se pudo eliminar la review con id ${reviewId}.`);
      }
};

module.exports = {
    getSites,
    getSiteById,
    deleteSite,
    createSite,
    addReview,
    updateSite,
    deleteReview
}
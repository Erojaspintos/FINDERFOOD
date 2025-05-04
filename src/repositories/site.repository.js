const Site = require("../models/site.model");
const connectToRedis = require("../services/redis.service");
const dayjs = require("dayjs");
const siteUpdateSchema = require('../models/schemas/siteUpdateSchema');

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

const _getSitesRedisKey = (userId, filter) => `userId: ${userId}-sites:${JSON.stringify(filter)}`;

const getSites = async (filter, userId) => {
    const redisClient = await connectToRedis();
    const sitesRedisKey = _getSitesRedisKey(userId, filter);
    let sites = await redisClient.get(sitesRedisKey);
    const mongoFilter = buildMongoFilter(filter);
    const maxDistance = filter.maxDistance || process.env.MAX_DISTANCE_DEFAULT;

    if (filter.startLat && filter.startLong) {
    mongoFilter.location =  {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [filter.startLong, filter.startLat],
          },
          $maxDistance: maxDistance
        }
      };
    }
      if (!sites) {
        console.log("[Reading from Mongo]");
        sites = await Site.find(mongoFilter);
        await redisClient.set(sitesRedisKey, JSON.stringify(sites), { ex: 30 }); // ese 60 es pa que dure un mintuo
    } else{
        console.log("[Reading from Redis]");
        sites = JSON.parse(sites);
    }
    return sites;
};

const buildMongoFilter = (filter) => {
    const allowedFields = Object.keys(siteUpdateSchema.paths).filter(key => key !== '_id' && key !== '__v');
    const mongoFilter = {};
    for (const key in filter) {
        if (allowedFields.includes(key)) {
            mongoFilter[key] = filter[key];
        }
    }
    
    return mongoFilter;
};

const createSite = async (model, userId) => {
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
        location: {
            type: "Point",
            coordinates: [model.longitude, model.latitude]
        },
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

    site.reviews.push({
        comment: model.comment,
        stars: model.stars,
        userId: userId,
        creationDate: creationDate
    });

    console.log(site)
    await site.save();
}

const updateSite = async (siteId, model) => {
    const site = await getSiteById(siteId);
    if (site) {

        //revisar con Eze, updated no hace nada
       // const updated = await Site.updateOne({ _id: siteId }, model);
        //return { ...site.toObject(), ...model };

        await Site.updateOne({ _id: siteId }, model);
        return getSiteById(siteId);

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
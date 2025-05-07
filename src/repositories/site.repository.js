const Site = require("../models/site.model");
const { connectToRedis } = require("../services/redis.service");
const dayjs = require("dayjs");
const siteUpdateSchema = require('../models/schemas/siteUpdateSchema');
const { Types } = require("mongoose");
 
const getSiteById = async (id) => {
    try {
        let site = await Site.findOne({ _id: id });
        return site;
    } catch (error) {
        return null;
    }
};
 
const _getSitesRedisKey = (userId, filter) => `userId:${userId}-sites:${JSON.stringify(filter)}`;
 
const getSites = async (filter, userId) => {
    const redisClient = await connectToRedis();
   
    const sitesRedisKey = _getSitesRedisKey(userId, filter);
    let sites = await redisClient.get(sitesRedisKey);
 
    const mongoFilter = buildMongoFilter(filter);
    const maxDistance = filter.maxDistance || process.env.MAX_DISTANCE_DEFAULT;
 
    if (filter.name)
        mongoFilter.name = { $regex: filter.name, $options: "i" }; // "i" para que no sea case sensitive
 
    if (filter.startLat && filter.startLong) {
        mongoFilter.location = {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [filter.startLong, filter.startLat],
                },
                $maxDistance: maxDistance
            }
        };
    }

  // Extraer y validar limit y skip
  const limit = parseInt(filter.limit) || process.env.LIMIT_DEFAULT; 
  const skip = parseInt(filter.skip) || process.env.SKIP_DEFAULT;

    if (!sites) {
        console.log("[Reading from Mongo]");
        sites = await Site.find(mongoFilter)
        .skip(skip)
        .limit(limit);
        await redisClient.set(sitesRedisKey, JSON.stringify(sites), { ex: 600 }); // ese 60 es pa que dure un mintuo
    } else {
        console.log("[Reading from Redis]");
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
 
    const siteExiste = await Site.findOne({
        name: model.name,
        latitude: model.latitude,
        longitude: model.longitude
    });
 
    if (siteExiste) {
        throw new Error("SITE_ALREADY_EXISTS");
    }
 
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
};
 
const updateSite = async (siteId, model) => {
    const site = await getSiteById(siteId);
    if (site) {
        const updated = await Site.updateOne({ _id: siteId }, model);
        if (updated.modifiedCount > 0)
            return { ...site.toObject(), ...model };
        else
            throw new Error("No se realizaron cambios en el sitio.");
    }
    else
        return null;
};
 
const deleteSite = async (id, userId, userRole) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("El ID de sitio es inválido.");
  }
 
  const site = await Site.findOne({ _id: id });
 
  if (!site) {
    throw new Error("SITE_NOT_EXIST");
  }
 
  const isCreator = site.userId.toString() === userId.toString();
  const isAdmin = userRole === "admin";
 
  if (!isCreator && !isAdmin) {
    throw new Error("USER_NOT_CREATOR");
  }
 
  const result = await Site.deleteOne({ _id: id });
 
  if (result.deletedCount === 0) {
    throw new Error("SITE_DELETE_FAILED");
  }
};
 
 
const addReview = async (siteId, model, userId) => {
    const creationDate = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const site = await getSiteById(siteId);
 
    if (!site) throw new Error("SITE_NOT_EXIST");
 
    site.reviews.push({
        comment: model.comment,
        stars: model.stars,
        userId: userId,
        creationDate: creationDate
    });
    await site.save();
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
 
const updateSiteReview = async (siteId, reviewId, model, userId) => {
 
    const site = await getSiteById(siteId);
    if (!site) {
        throw new Error("SITE_NOT_EXIST");
    }
    const review = site.reviews.find(r => r._id.toString() === reviewId);
    if (!review) {
        throw new Error("REVIEW_NOT_EXIST");
    }
    if (review.userId.toString() !== userId.toString()) {
        throw new Error("USER_NOT_CREATOR");
    }
    review.comment = model.comment;
    review.stars = model.stars;
    await site.save();
    return review;
};
 
module.exports = {
    getSites,
    getSiteById,
    deleteSite,
    createSite,
    addReview,
    updateSite,
    deleteReview,
    updateSiteReview
}
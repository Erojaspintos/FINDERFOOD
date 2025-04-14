const Site = require("../models/site.model");
const dayjs = require("dayjs");

const getSiteById = async (id) => {
    return await Site.findOne({_id: id});
}

const getSites = async (filter) => {
    return await Site.find(filter);
}

const createSite = async(model, userId) =>{

    console.log(model);

    const newSite = new Site({
        name : model.name,
        country : model.country,
        state : model.state,
        city : model.city,
        address : model.address,
        description: model.description,
        type : model.type,
        userId : userId,
        latitude: model.latitude,
        longitude: model.longitude,
        reviews: []
    })
    await newSite.save();
}
/*
const getSites = async() =>{
    const sites = await Site.

    return sites;
}*/

const deleteSite = async(id, userId)=>{
    await Site.deleteOne({_id: id, userId: userId});
}


const addReview = async(siteId, model, userId) =>{
    const creationDate = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const site = await getSiteById(siteId);

    site.reviews.push({
        comment : model.comment,
        stars : model.stars,
        userId : userId,
        creationDate : creationDate
    });
    
    console.log(site)
    await Site.updateOne(site);
}

module.exports = {
    getSites,
    getSiteById,
    deleteSite,
    createSite,
    addReview
}
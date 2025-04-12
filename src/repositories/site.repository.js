const Site = require("../models/site.model");
const mongoose = require("mongoose");

const createSite = async(name, userId) =>{
    const newSite = new Site({
        name : name,
        userId : userId
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

module.exports = {
    deleteSite
}
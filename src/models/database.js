const dayjs = require('dayjs');
const siteSchema = require("../models/schemas/siteSchema")
const mongoose = require("mongoose");

//const Site = mongoose.model("Site", siteSchema);

const sites = [
  {
    id: 1,
    name: "Ramona",
    country: "Uruguay",
  },
  {
    id: 2,
    name: "La comedia",
    country: "Argentina",
    reviews: [{
      id: 1,
      comment: "Lugar ideal para almorzar con amigos o familia",
      stars:4,
      creationDate: "2025-04-01 21:32:00",
      userId: 1
    }]
  },
  {
    id: 3,
    name: "One Love",
    country: "Uruguay",
    reviews: [{
      id: 2,
      comment: "Lugar feo",
      stars:1,
      creationDate: "2025-04-01 21:32:00",
      userId: 1
    },
    {
      id: 4,
      comment: "Lugar lindo",
      stars:3,
      creationDate: "2025-04-01 21:32:00",
      userId: 2
    },
    ]
  },
  {
    id: 4,
    name: "El celiaco feliz",
    country: "Uruguay"
  },
];

const getSites = (filter) => {
  if (filter.country != undefined)
    return sites.filter(s => s.country == filter.country);

  return sites;
}

const findSiteById = (id) => {
  return sites.find(s => s.id == id);
}

const findByIndex = (id) => {
  return sites.findIndex((s) => s.id == id);
};

const createSite = (model) => {
  const lastSite = sites[sites.length - 1];
  const newSite = {
    name: model.name,
    country: model.country
  };
  if (lastSite) {
    newSite.id = lastSite.id + 1;
  } else {
    newSite.id = 1;
  }
  sites.push(newSite);
};

const updateSite = (id, model) => {
  const index = findByIndex(id);
  if (index >= 0) {
    sites[index] = { ...sites[index], ...model };
    return sites[index]; //devuelve el sitio actualizado
  }
  return null;
};

const deleteSite = (id) => {
  let indexToBeDeleted = sites.findIndex((site) => site.id == id);
  if (indexToBeDeleted >= 0) {
    sites.splice(indexToBeDeleted, 1);
  }
}

const findReviewById = (site, reviewId) => {
  console.log(site.reviews);
  console.log("reviewId " + reviewId);
  const review = site.reviews.find(s => s.id == reviewId);
  return review;
};

const deleteReview = (siteId, reviewId) => {
  const index = findByIndex(siteId);
  const reviewIndex = sites.findIndex(s => s.id == reviewId);
  console.log(siteId + "--" + reviewId);

  if (index >= 0)
    sites[index].reviews.splice(reviewIndex, 1);
}

const addReview = (siteId, body, userId) => {
  const index = findByIndex(siteId);
  if (index < 0) return null;

  body.creationDate = dayjs().format('YYYY-MM-DD HH:mm:ss');
  body.userId = userId; // forzar userId autenticado

  if (!Array.isArray(sites[index].reviews)) {
    sites[index].reviews = [];
  }

  const reviews = sites[index].reviews;

  const userAlreadyReviewed = reviews.find(r => r.userId === userId); //asumo que se puede imgresar unua unica review por usuario
  if (userAlreadyReviewed) {
    return null;
  }

  //suma 1 al Id de reviews
  const maxId = reviews.reduce((max, r) => r.id > max ? r.id : max, 0);
  body.id = maxId + 1;

  reviews.push(body);
  return body;
};



module.exports = {
  getSites,
  findSiteById,
  findByIndex,
  createSite,
  updateSite,
  deleteSite,
  findReviewById,
  addReview,
  deleteReview
};

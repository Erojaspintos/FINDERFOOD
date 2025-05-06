const fs = require("fs");
const path = require("path");

const logRequest = (req) => {

  const now = new Date().toISOString();

  console.log(`[${now}] METHOD: ${req.method} ${req.url}`);

};

module.exports = logRequest;

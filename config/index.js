const env = process.env.NODE_ENV;

if (!env) {
  throw new Error('NODE_ENV is not defined');
}

let config;

try {
  config = require(`../config/${env}`);
} catch (e) {
  throw new Error(`No configuration file found for NODE_ENV=${env}`);
}

module.exports = config;
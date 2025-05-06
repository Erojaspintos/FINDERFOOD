const { Redis } = require("@upstash/redis");

const REDIS_URL = process.env.REDIS_URL;
const REDIS_TOKEN = process.env.REDIS_TOKEN;

let redisClient = null;

const connectToRedis = () => {
  if (!redisClient) {
    const connectionOpts = {
      url: REDIS_URL,
      token: REDIS_TOKEN,
    };
    redisClient = new Redis(connectionOpts);
  }
  return redisClient;
};

const cleanCache = async (userId) => {
  try {
    const redis = connectToRedis();
    const pattern = `userId:${userId}-sites:*`;

    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`Cache borrada para userId: ${userId} (${keys.length} claves)`);
    } else {
      console.log(`No hay cache para borrar del userId: ${userId}`);
    }
  } catch (error) {
    console.error("Error al borrar cache:", error.message);
  }
};

module.exports = { connectToRedis, cleanCache };

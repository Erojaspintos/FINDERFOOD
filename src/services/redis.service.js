const REDIS_TOKEN = process.env.REDIS_TOKEN;

let redisClient = null;

const connectToRedis = ()=>{
    if(!redisClient){
        const connectionOpts = {
            url: REDIS_URL,
            token: REDIS_TOKEN,
        };

        redisClient = new redisClient(connectionOpts)
    }
    return redisClient;
}
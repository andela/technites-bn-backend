import dotenv from 'dotenv';
import redis from 'redis';

dotenv.config();

// if in development mode use Redis file attached

// start redis as a child process
const redisClient = redis.createClient(process.env.REDIS_URL);
// process.env.REDIS_URL is the redis url config variable name on heroku.
// if local use redis.createClient()

export default redisClient;

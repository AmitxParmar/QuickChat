import dotenv from "dotenv";
import Redis from "ioredis";
dotenv.config();

/* let redisInstance: Redis;

function getRedisInstance() {
  if (!redisInstance) redisInstance = new Redis(getRedisUrl());
  return redisInstance;
} */
const getRedisUrl = (): string => {
  if (process.env.UPSTASH_REDIS_REST_URL) {
    return process.env.UPSTASH_REDIS_REST_URL;
  }
  throw new Error("REDIS_URL is not defined!");
};

export const redis = new Redis(getRedisUrl());



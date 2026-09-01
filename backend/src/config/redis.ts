import { Redis } from 'ioredis';
import logger from '../utils/logger.js';

let redisClient: Redis | null = null;

export const getRedisClient = (): Redis | null => {
  if (redisClient) {
    return redisClient;
  }

  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl || redisUrl.includes('localhost')) {
    logger.warn('REDIS_URL not configured or is localhost — Redis features disabled');
    return null;
  }

  try {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: true,
      tls: {},
    });

    redisClient.on('error', (err: Error) => {
      logger.error('Redis error:', err.message);
    });

    redisClient.on('connect', () => {
      logger.info('Redis connected successfully');
    });

    return redisClient;
  } catch (error) {
    logger.error('Failed to initialize Redis:', error);
    return null;
  }
};

export const closeRedisConnection = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
};

export default getRedisClient;

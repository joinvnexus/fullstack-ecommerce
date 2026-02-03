import { Redis } from 'ioredis';
import type { RedisOptions } from 'ioredis';

export interface CacheService {
  getCachedProductsList(key: string): Promise<any>;
  cacheProductsList(key: string, data: any, ttl: number): Promise<void>;
  invalidateProductsCache(): Promise<void>;
  invalidateProductCache(productId: string): Promise<void>;
}

class CacheServiceImpl implements CacheService {
  private redis: Redis | null = null;
  private redisErrorLogged = false;

  constructor() {
    // Initialize Redis if URL is provided
    const redisUrl = process.env.REDIS_URL;
    
    if (!redisUrl || redisUrl.includes('localhost')) {
      // Skip Redis initialization for local development or invalid URLs
      if (!redisUrl) {
        console.info('ℹ️  Redis not configured - caching disabled');
      } else {
        console.warn('⚠️  REDIS_URL contains localhost - caching disabled (use a Redis provider for production)');
      }
      return;
    }

    try {
      const options: RedisOptions = {
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
        lazyConnect: true,
      };

      this.redis = new Redis(redisUrl, options);

      this.redis.connect().catch((err) => {
        if (!this.redisErrorLogged) {
          console.warn('⚠️  Redis connection failed - caching disabled:', err.message);
          this.redisErrorLogged = true;
        }
        this.redis = null;
      });

      this.redis.on('error', (err) => {
        if (!this.redisErrorLogged) {
          console.warn('⚠️  Redis error - caching disabled:', err.message);
          this.redisErrorLogged = true;
        }
        this.redis = null;
      });

      this.redis.on('connect', () => {
        console.info('✅ Redis connected successfully');
      });
    } catch (error) {
      console.warn('⚠️  Failed to initialize Redis - caching disabled');
      this.redis = null;
    }
  }

  async getCachedProductsList(key: string): Promise<any> {
    if (!this.redis) return null;
    try {
      const cached = await this.redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      return null;
    }
  }

  async cacheProductsList(key: string, data: any, ttl: number): Promise<void> {
    if (!this.redis) return;
    try {
      await this.redis.setex(key, ttl, JSON.stringify(data));
    } catch (error) {
      // Silently fail - caching is optional
    }
  }

  async invalidateProductsCache(): Promise<void> {
    if (!this.redis) return;
    try {
      const keys = await this.redis.keys('products:*');
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      // Silently fail
    }
  }

  async invalidateProductCache(productId: string): Promise<void> {
    if (!this.redis) return;
    try {
      const keys = await this.redis.keys(`product:${productId}*`);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      // Silently fail
    }
  }
}

export const cacheService = new CacheServiceImpl();

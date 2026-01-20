import { Redis } from 'ioredis';

export interface CacheService {
  getCachedProductsList(key: string): Promise<any>;
  cacheProductsList(key: string, data: any, ttl: number): Promise<void>;
  invalidateProductsCache(): Promise<void>;
  invalidateProductCache(productId: string): Promise<void>;
}

class CacheServiceImpl implements CacheService {
  private redis: Redis | null = null;

  constructor() {
    // Initialize Redis if URL is provided
    const redisUrl = process.env.REDIS_URL;
    if (redisUrl) {
      try {
        this.redis = new Redis(redisUrl);
        this.redis.on('error', (err) => {
          console.warn('Redis connection error:', err.message);
          this.redis = null; // Disable caching on error
        });
      } catch (error) {
        console.warn('Failed to initialize Redis:', error);
        this.redis = null;
      }
    }
  }

  async getCachedProductsList(key: string): Promise<any> {
    if (!this.redis) return null;
    try {
      const cached = await this.redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.warn('Cache read error:', error);
      return null;
    }
  }

  async cacheProductsList(key: string, data: any, ttl: number): Promise<void> {
    if (!this.redis) return;
    try {
      await this.redis.setex(key, ttl, JSON.stringify(data));
    } catch (error) {
      console.warn('Cache write error:', error);
    }
  }

  async invalidateProductsCache(): Promise<void> {
    if (!this.redis) return;
    try {
      // Invalidate all product-related keys
      const keys = await this.redis.keys('products:*');
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      console.warn('Cache invalidation error:', error);
    }
  }

  async invalidateProductCache(productId: string): Promise<void> {
    if (!this.redis) return;
    try {
      // Invalidate specific product cache
      const keys = await this.redis.keys(`product:${productId}*`);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      console.warn('Cache invalidation error:', error);
    }
  }
}

export const cacheService = new CacheServiceImpl();
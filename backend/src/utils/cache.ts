import NodeCache from 'node-cache';

interface CacheConfig {
  stdTTL: number;
  checkperiod: number;
  useClones: boolean;
}

class Cache {
  private static instance: Cache;
  private cache: NodeCache;

  private constructor(config: CacheConfig) {
    this.cache = new NodeCache(config);
  }

  public static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache({
        stdTTL: 600, // 10 minutes
        checkperiod: 120, // 2 minutes
        useClones: false
      });
    }
    return Cache.instance;
  }

  public get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  public set<T>(key: string, value: T, ttl?: number): boolean {
    return this.cache.set(key, value, ttl || 0);
  }

  public del(key: string | string[]): number {
    return this.cache.del(key);
  }

  public flush(): void {
    this.cache.flushAll();
  }

  public stats() {
    return this.cache.getStats();
  }
}

export const cacheManager = Cache.getInstance();
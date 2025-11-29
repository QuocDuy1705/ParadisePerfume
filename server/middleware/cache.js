import NodeCache from "node-cache";

// Create cache instance
// stdTTL: time to live in seconds (default 10 minutes)
// checkperiod: period in seconds to check for expired keys (default 10 minutes)
const cache = new NodeCache({ stdTTL: 600, checkperiod: 600 });

/**
 * Cache middleware
 * @param {number} duration - Cache duration in seconds
 */
export const cacheMiddleware = (duration = 600) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== "GET") {
      return next();
    }

    const key = req.originalUrl || req.url;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      console.log(`✅ Cache HIT: ${key}`);
      return res.json(cachedResponse);
    }

    console.log(`❌ Cache MISS: ${key}`);

    // Store original res.json
    const originalJson = res.json.bind(res);

    // Override res.json
    res.json = (body) => {
      // Cache the response
      cache.set(key, body, duration);
      return originalJson(body);
    };

    next();
  };
};

/**
 * Clear cache by pattern
 * @param {string} pattern - Pattern to match keys (e.g., '/api/products')
 */
export const clearCacheByPattern = (pattern) => {
  const keys = cache.keys();
  const matchedKeys = keys.filter((key) => key.includes(pattern));

  matchedKeys.forEach((key) => {
    cache.del(key);
  });

  console.log(
    `🗑️ Cleared ${matchedKeys.length} cache entries matching: ${pattern}`
  );
  return matchedKeys.length;
};

/**
 * Clear specific cache key
 * @param {string} key - Cache key to clear
 */
export const clearCache = (key) => {
  const deleted = cache.del(key);
  console.log(`🗑️ Cache cleared for: ${key}`);
  return deleted;
};

/**
 * Clear all cache
 */
export const clearAllCache = () => {
  cache.flushAll();
  console.log("🗑️ All cache cleared");
};

/**
 * Get cache stats
 */
export const getCacheStats = () => {
  return cache.getStats();
};

export default cache;

const NodeCache = require("node-cache")

// Set cache for 5 secs, check for stale expired caches every 8 sec
const cache = new NodeCache({ stdTTL: 5, checkperiod: 8 })

const getCachedData = (key) => {
  return cache.get(key)
}

const setCachedData = (key, data, ttl = 5) => {
  cache.set(key, data, ttl)
}

const invalidateCache = (key) => {
  cache.del(key)
}

module.exports = {
  getCachedData,
  setCachedData,
  invalidateCache,
}

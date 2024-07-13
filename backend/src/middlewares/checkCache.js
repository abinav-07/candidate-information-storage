const { getCachedData } = require("../services/cache")

function checkCache(req, res, next) {
  try {
    // Get cached data if exists, if not pass to next func
    const cachedData = getCachedData(req.path)

    if (cachedData) {
      res.status(200).json(cachedData)
      return
    }

    next()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  checkCache,
}

const express = require("express")
const router = express.Router()

//Controllers
const BasicAuthControllers = require("../controllers/auth/basicAuth")
const { checkVerifiedJWTToken } = require("../middlewares/checkJWT")

// Authentication routes
router.post("/auth/login", BasicAuthControllers.loginUser)
router.post("/auth/logout", checkVerifiedJWTToken, BasicAuthControllers.logout)

module.exports = router

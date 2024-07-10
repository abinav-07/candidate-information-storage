const express = require("express")
const router = express.Router()

//Controllers
const BasicAuthControllers = require("../controllers/auth/basicAuth")
const OAuthControllers = require("../controllers/auth/oAuth")
const { checkUnverifiedJWTToken, checkVerifiedJWTToken } = require("../middlewares/checkJWT")

// Authentication routes
router.post("/auth/register", BasicAuthControllers.registerUser)
router.post("/auth/login", BasicAuthControllers.loginUser)

// OAuth Signins
// Facebook
router.post("/oauth/facebook/callback", BasicAuthControllers.loginUser)

// Google
router.post("/oauth/google/callback", OAuthControllers.GoogleOAuthCallback)

// Linked In
router.post("/oauth/linked-in/callback", BasicAuthControllers.loginUser)

// Common Authorized Routes
router.patch(
  "/auth/me/update-profile",
  checkVerifiedJWTToken,
  BasicAuthControllers.updateUserProfile
)
router.patch("/auth/verify-otp", checkUnverifiedJWTToken, BasicAuthControllers.verifyOTP)
router.get("/auth/resend-otp", checkUnverifiedJWTToken, BasicAuthControllers.resendOTP)
router.post("/auth/logout", checkUnverifiedJWTToken, BasicAuthControllers.logout)

module.exports = router

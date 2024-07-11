const express = require("express")
const router = express.Router()

//Controllers
const AdminControllers = require("../controllers/admins")
const { checkVerifiedJWTToken, checkAdmin } = require("../middlewares/checkJWT")

// Authentication routes
router.get("/candidate", [checkVerifiedJWTToken, checkAdmin], AdminControllers.getAllCandidates)
router.post(
  "/candidate",
  [checkVerifiedJWTToken, checkAdmin],
  AdminControllers.createCandidateProfile
)
router.patch(
  "/candidate/:id",
  [checkVerifiedJWTToken, checkAdmin],
  AdminControllers.updateCandidateProfile
)

module.exports = router

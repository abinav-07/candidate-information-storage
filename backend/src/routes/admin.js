const express = require("express")
const router = express.Router()

//Controllers
const AdminControllers = require("../controllers/admins")
const { checkVerifiedJWTToken, checkAdmin } = require("../middlewares/checkJWT")
const { checkCache } = require("../middlewares/checkCache")

// Authentication routes
router.get("/candidate", [checkVerifiedJWTToken, checkAdmin,checkCache], AdminControllers.getAllCandidates)
router.get("/candidate/:id", [checkVerifiedJWTToken, checkAdmin,checkCache], AdminControllers.getCandidate)

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

router.delete(
  "/candidate/:id",
  [checkVerifiedJWTToken, checkAdmin],
  AdminControllers.deleteCandidateProfile
)

module.exports = router

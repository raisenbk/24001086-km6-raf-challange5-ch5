const router = require("express").Router()

const authController = require("../controllers/authController")
const auth = require("../middlewares/authenticate")
const checkSuperAdmin = require("../middlewares/checkSuperAdmin")
const upload = require("../middlewares/uploader")

router.get("/", authController.findAuths)
router.post("/register", authController.register, upload.array("images"),auth, checkSuperAdmin)
router.post("/login", authController.login)
router.get("/me", auth, authController.us)

module.exports = router
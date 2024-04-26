const router = require("express").Router()
const upload = require("../middlewares/uploader")

const carController = require("../controllers/carController")
const auth = require("../middlewares/authenticate")
const checkSuperAdmin = require("../middlewares/checkSuperAdmin")

router.get("/", auth, carController.getAllCar)

router.post("/create", auth, upload.single("image"), carController.createCar)

router.patch("/edit/:id", auth, checkSuperAdmin, upload.single("image"), carController.updateCar)

router.get("/:id", auth, carController.getCarById)

router.delete("/delete/:id", auth, checkSuperAdmin, carController.deleteCar)

module.exports = router
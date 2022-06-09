const express = require("express")
const router = express.Router()
const controller = require("./constrollers/userController")

router.get("/", controller.home)
router.post("/register", controller.register)

module.exports = router
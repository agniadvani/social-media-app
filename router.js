const express = require("express")
const router = express.Router()
const userController = require("./controllers/userController")
const postController = require("./controllers/postController")

// User related routes
router.get("/", userController.home)
router.post("/register", userController.register)
router.post("/login", userController.login)
router.post("/logout", userController.logout)

// Post Related routes
router.get("/create-post", userController.mustBeLoggedIn, postController.viewCreatePostScreen)
router.post("/create-post", userController.mustBeLoggedIn, postController.createPost)
router.get("/post/:id", postController.viewSingle)

// Profile Related routes
router.get("/profile/:username", userController.ifUserExists, userController.profilePostsScreen)
module.exports = router
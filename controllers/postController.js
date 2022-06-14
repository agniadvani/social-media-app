const Post = require("../models/Post")

exports.viewCreatePostScreen = (req, res) => {
    res.render("create-post.ejs")
}

exports.createPost = (req, res) => {
    let post = new Post(req.body)

    post.create().then(() => {
        res.send("New post created.")
    }).catch((errors) => {
        res.send(errors)
    })
}
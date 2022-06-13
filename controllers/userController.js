const User = require("../models/User")
const { use } = require("../router")


exports.home = (req, res) => {
    if (req.session.user) {
        res.send(`Hi ${req.session.user.username}`)
    } else {
        res.render("home-guest")
    }
}

exports.register = (req, res) => {
    let user = new User(req.body)
    user.register()

    if (user.errors.length) {
        res.send(user.errors)
    } else {
        res.send("Congrats, there were no errors.")
    }
}

exports.login = (req, res) => {
    let user = new User(req.body)
    user.login().then((result) => {
        req.session.user = { favColor: "blue", username: user.data.username }
        res.send(result)
    }).catch((e) => {
        res.send(e)
    })
}
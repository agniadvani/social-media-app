const User = require("../models/User")
const { use } = require("../router")


exports.home = (req, res) => {
    if (req.session.user) {
        res.render("home-logged-in-no-results.ejs", { username: req.session.user.username })
    } else {
        res.render("home-guest")
    }
}

exports.register = (req, res) => {
    let user = new User(req.body)
    user.cleanUp()
    user.validate()


    if (user.errors.length) {
        res.send(user.errors)
    } else {
        res.send("Congrats, there were no errors.")
        user.register()
    }
}

exports.login = (req, res) => {
    let user = new User(req.body)
    user.login().then((result) => {
        req.session.user = { favColor: "blue", username: user.data.username }
        req.session.save(() => { res.redirect("/") })

    }).catch((e) => {
        res.send(e)
    })
}

exports.logout = (req, res) => {
    req.session.destroy(() => { res.redirect("/") })
}
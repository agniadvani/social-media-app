const User = require("../models/User")
const { use } = require("../router")


exports.home = (req, res) => {
    if (req.session.user) {
        res.render("home-logged-in-no-results.ejs")
    } else {
        res.render("home-guest", { errors: req.flash('errors'), regError: req.flash('regError') })
    }
}

exports.register = (req, res) => {
    let user = new User(req.body)
    user.register().then(() => {
        req.session.user = { username: user.data.username, avatar: user.avatar, _id: user.data._id }
        req.session.save(() => { res.redirect("/") })
    }).catch((regErrors) => {
        regErrors.forEach((error) => {
            req.flash("regError", error)
        })
        req.session.save(() => { res.redirect("/") })
    })
}

exports.login = (req, res) => {
    let user = new User(req.body)
    user.login().then((result) => {
        req.session.user = { username: user.data.username, avatar: user.avatar, _id: user.data._id }
        req.session.save(() => { res.redirect("/") })

    }).catch((e) => {
        req.flash('errors', e)
        req.session.save(() => { res.redirect("/") })
    })
}

exports.mustBeLoggedIn = (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        req.flash('errors', "You must be logged in to access this feature.")
        req.session.save(() => { res.redirect("/") })
    }
}

exports.logout = (req, res) => {
    req.session.destroy(() => { res.redirect("/") })
}
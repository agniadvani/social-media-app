const User = require("../models/User")
const { use } = require("../router")


exports.home = (req, res) => {
    if (req.session.user) {
        res.render("home-logged-in-no-results.ejs", { username: req.session.user.username, avatar: req.session.user.avatar })
    } else {
        res.render("home-guest", { errors: req.flash('errors'), regError: req.flash('regError') })
    }
}

exports.register = (req, res) => {
    let user = new User(req.body)
    user.register().then(() => {
        req.session.user = { username: user.data.username, avatar: user.avatar }
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
        req.session.user = { username: user.data.username, avatar: user.avatar }
        req.session.save(() => { res.redirect("/") })

    }).catch((e) => {
        req.flash('errors', e)
        req.session.save(() => { res.redirect("/") })
    })
}

exports.logout = (req, res) => {
    req.session.destroy(() => { res.redirect("/") })
}
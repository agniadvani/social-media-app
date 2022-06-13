const userCollection = require('../db').db().collection("users")
const bcrypt = require('bcryptjs')
const validator = require("validator")

let User = function (data) {
    this.data = data
    this.errors = []
}

User.prototype.cleanUp = function () {
    if (typeof (this.data.username) != "string") { this.data.username = "" }
    if (typeof (this.data.email) != "string") { this.data.email = "" }
    if (typeof (this.data.password) != "string") { this.data.password = "" }

    this.data = {
        username: this.data.username.trim().toLowerCase(),
        email: this.data.email.trim().toLowerCase(),
        password: this.data.password
    }

}

User.prototype.validate = function () {
    if (this.data.username === "") { this.errors.push("Please enter the username.") }
    if (this.data.username !== "" && !validator.isAlphanumeric(this.data.username)) { this.errors.push("Username can only contain letters and numbers.") }
    if (!validator.isEmail(this.data.email)) { this.errors.push("Please enter a valid email.") }
    if (this.data.password === "") { this.errors.push("Please enter the password.") }
    if (this.data.password.length > 0 && this.data.password.length < 8) { this.errors.push("Password must be at least 8 characters.") }
    if (this.data.password.length > 50) { this.errors.push("Password must be less than 50 characters.") }
    if (this.data.username.length > 0 && this.data.password.length < 3) { this.errors.push("Username must be at least 3 characters.") }
    if (this.data.username.length > 30) { this.errors.push("Username must be less than 100 characters.") }
}

User.prototype.login = function () {
    return new Promise((resolve, reject) => {
        userCollection.findOne({ username: this.data.username }).then((user) => {
            if (user && bcrypt.compareSync(this.data.password, user.password)) {
                resolve(`You are now logged in as ${user.username}.`)
            } else {
                reject("You have entered incorrect username/password.")
            }
        }).catch(() => {
            reject("Please try again.")
        })
    })
}
User.prototype.register = function () {
    // Hashing password before storing it into DB

    let salt = bcrypt.genSaltSync(10)
    let password = bcrypt.hashSync(this.data.password, salt)
    this.data.password = password

    //Storing user in DB
    userCollection.insertOne(this.data)

}

module.exports = User
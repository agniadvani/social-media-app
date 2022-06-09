const userCollection = require('../db').collection("users")
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
    if (this.data.password.length > 100) { this.errors.push("Password must be less than 100 characters.") }
    if (this.data.username.length > 0 && this.data.password.length < 8) { this.errors.push("Username must be at least 8 characters.") }
    if (this.data.username.length > 30) { this.errors.push("Username must be less than 100 characters.") }
}

User.prototype.login = function (callback) {
    userCollection.findOne({ username: this.data.username }, (err, user) => {
        if (user && this.data.password == user.password) {
            callback(`You are now logged in as ${user.username}.`)
        } else {
            callback("You have entered incorrect username/password.")
        }
    })
}
User.prototype.register = function () {
    //Validation

    this.cleanUp()
    this.validate()

    //Storing user in DB
    userCollection.insertOne(this.data)
}

module.exports = User
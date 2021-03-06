const userCollection = require('../db').db().collection("users")
const bcrypt = require('bcryptjs')
const validator = require("validator")
const md5 = require("md5")

let User = function (data, getAvatar) {
    this.data = data
    this.errors = []
    if (getAvatar == undefined) { this.getAvatar = false }
    if (getAvatar) { this.getAvatar() }
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
    return new Promise(async (resolve, reject) => {
        if (this.data.username === "") { this.errors.push("Please enter the username.") }
        if (this.data.username !== "" && !validator.isAlphanumeric(this.data.username)) { this.errors.push("Username can only contain letters and numbers.") }
        if (!validator.isEmail(this.data.email)) { this.errors.push("Please enter a valid email.") }
        if (this.data.password === "") { this.errors.push("Please enter the password.") }
        if (this.data.password.length > 0 && this.data.password.length < 8) { this.errors.push("Password must be at least 8 characters.") }
        if (this.data.password.length > 50) { this.errors.push("Password must be less than 50 characters.") }
        if (this.data.username.length > 0 && this.data.username.length < 3) { this.errors.push("Username must be at least 3 characters.") }
        if (this.data.username.length > 30) { this.errors.push("Username must be less than 100 characters.") }

        // Checking if the username has already been taken after it's validation

        if (this.data.username.length > 2 && this.data.username.length < 30 && validator.isAlphanumeric(this.data.username)) {
            let userNameTaken = await userCollection.findOne({ username: this.data.username })
            if (userNameTaken) { this.errors.push("The username has already been taken.") }
        }

        // Checking if the email has already been taken after it's validation

        if (validator.isEmail(this.data.email)) {
            let emailTaken = await userCollection.findOne({ email: this.data.email })
            if (emailTaken) { this.errors.push("The email is already being used.") }
        }

        resolve()
    })
}

User.prototype.login = function () {
    return new Promise((resolve, reject) => {
        userCollection.findOne({ username: this.data.username }).then((user) => {
            if (user && bcrypt.compareSync(this.data.password, user.password)) {
                this.data = user
                this.getAvatar()
                resolve(`You are now logged in as ${user.username}.`)
            } else {
                reject("You have entered incorrect username/password.")
            }
        }).catch(() => {
            reject("Login problem.")
        })
    })
}
User.prototype.register = function () {
    return new Promise(async (resolve, reject) => {
        this.cleanUp()
        await this.validate()
        // Hashing password before storing it into DB
        if (!this.errors.length) {
            let salt = bcrypt.genSaltSync(10)
            let password = bcrypt.hashSync(this.data.password, salt)
            this.data.password = password

            //Storing user in DB
            await userCollection.insertOne(this.data)
            this.getAvatar()
            resolve()
        } else {
            reject(this.errors)
        }
    })
}

User.prototype.getAvatar = function () {
    this.avatar = `https://secure.gravatar.com/avatar/${md5(this.data.email)}`
}

User.findUserbyUsername = function (username) {
    return new Promise((resolve, reject) => {
        userCollection.findOne({ username: username }).then((userDoc) => {
            userDoc = new User(userDoc, true)
            userDoc = {
                _id: userDoc.data._id,
                username: userDoc.data.username,
                avatar: userDoc.avatar
            }
            resolve(userDoc)
        }).catch(() => {
            reject()
        })
    })
}
module.exports = User
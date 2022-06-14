const postCollection = require("../db").db().collection("posts")

let Post = function (data) {
    this.data = data
    this.errors = []
}

Post.prototype.cleanUp = function () {
    if (typeof (this.data.title) != String) { this.data.title == "" }
    if (typeof (this.data.body) != String) { this.data.body == "" }

    this.data = {
        title: this.data.title.trim(),
        body: this.data.body.trim(),
        date: new Date()
    }
}

Post.prototype.validate = function () {
    if (this.data.title == "") { this.errors.push("Title cannot be empty.") }
    if (this.data.body == "") { this.errors.push("Body cannot be empty.") }
}

Post.prototype.create = function () {
    return new Promise((resolve, reject) => {
        this.cleanUp()
        this.validate()
        if (!this.errors.length) {
            postCollection.insertOne(this.data).then(() => {
                resolve()
            }).catch(() => {
                this.errors.push("Please try again.")
                reject(this.errors)
            })

        } else {
            reject(this.errors)
        }
    })
}

module.exports = Post
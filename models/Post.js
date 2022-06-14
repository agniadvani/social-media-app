const postCollection = require("../db").db().collection("posts")
const ObjectId = require("mongodb").ObjectId

let Post = function (data, userId) {
    this.data = data
    this.errors = []
    this.userId = ObjectId(userId)
}

Post.prototype.cleanUp = function () {
    if (typeof (this.data.title) != "string") { this.data.title == "" }
    if (typeof (this.data.body) != "string") { this.data.body == "" }

    this.data = {
        title: this.data.title.trim(),
        body: this.data.body.trim(),
        date: new Date(),
        author: this.userId
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

Post.findSingleById = function (id) {
    return new Promise(async (resolve, reject) => {
        if (typeof (id) != "string" || !ObjectId.isValid(id)) {
            reject()
            return
        }
        let posts = await postCollection.aggregate([
            { $match: { _id: new ObjectId(id) } },
            { $lookup: { from: "users", localField: "author", foreignField: "_id", as: "authorDocument" } },
            {
                $project: {
                    title: 1,
                    body: 1,
                    date: 1,
                    author: { $arrayElemAt: ["$authorDocument", 0] }
                }
            }
        ]).toArray()
        if (posts.length) {
            console.log(posts[0])
            resolve(posts[0])
        } else {
            reject()
        }
    })
}

module.exports = Post
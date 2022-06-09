const dotenv = require('dotenv')
dotenv.config()
const mongodb = require("mongodb").MongoClient

mongodb.connect(process.env.CONNECTIONSTRING, (err, client) => {
    module.exports = client.db()
    const app = require("./app")
    app.listen(process.env.PORT)
})
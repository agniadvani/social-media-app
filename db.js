const dotenv = require('dotenv')
dotenv.config()
const mongodb = require("mongodb").MongoClient

mongodb.connect(process.env.CONNECTIONSTRING, (err, client) => {
    if (err != null) {
        console.log(err)
        return
    }
    module.exports = client
    const app = require("./app")
    app.listen(process.env.PORT)
})
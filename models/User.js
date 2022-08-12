const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
        firstName: {type: String},
        lastName: {type: String, },
        username: {type: String},
        email: {type: String, required: true},
        password: {type: String, required: true},
    },
    {timestamps: true} //_id createdAt updatedAt ekleniyor
)

const User = mongoose.model("user", userSchema) // create users (yes with -s in mongoDB)
module.exports = { User }

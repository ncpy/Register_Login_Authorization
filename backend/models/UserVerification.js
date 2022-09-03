const mongoose = require("mongoose")

const UserVerificationSchema = new mongoose.Schema(
    {
        userId: {type: String},
        uniqueString: {type: String, },
        createdAt: {type: Date},
        expiresAt: {type: Date}
    },
)

const UserVerification = mongoose.model("UserVerification", UserVerificationSchema) // create users (yes with -s in mongoDB)
module.exports = { UserVerification }

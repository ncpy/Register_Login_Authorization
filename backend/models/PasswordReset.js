const mongoose = require("mongoose")

const passwordResetSchema = new mongoose.Schema(
    {
        userId: {type: String},
        resetString: {type: String},
        createdAt: {type: Date},
        expiresAt: {type: Date}
    },
    {timestamps: true} //_id createdAt updatedAt ekleniyor
)

const PasswordReset = mongoose.model("passwordReset", passwordResetSchema) // create users (yes with -s in mongoDB)
module.exports = { PasswordReset }

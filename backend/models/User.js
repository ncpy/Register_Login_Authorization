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

const passwordComplexity = require("joi-password-complexity")
const Joi = require("joi");
const validate = (data) => {
    const schema = Joi.object().keys({
        username: Joi.string()
            .min(3)
            .max(36)
            .required()
            .label("Username"),
        email: Joi.string()
            .min(5)
            .max(255)
            .required()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .label("Email"),
            //  "Email" must be a valid email
            //  "Email" length must be at least 5 characters long
        password: passwordComplexity()
            .required()
            .label("Password")
            //  "Password" should be at least 8 characters long.
            //  "Password" should contain at least 1 lower-cased letter.
            //  "Password" should contain at least 1 upper-cased letter.
            //  "Password" should contain at least 1 symbol.
    })
    return schema.validate(data)
}


const User = mongoose.model("user", userSchema) // create users (yes with -s in mongoDB)
module.exports = { User, validate }

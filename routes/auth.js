const router = require("express").Router()

// index.js de 3.no ile birlikte
router.get("/test", (req,res) => {
    res.send("auth works")
})

// 6
//postman de {"email":"ali@g.com", "password": "123"} gibi dene
router.post("/signup", (req,res) => {
    const { value, error } = validate(req.body);
    if (error) {
        res.status(422).send(error.details[0].message);
        console.log(error)
    } else {
        res.send("auth works")
    }
})
const passwordComplexity = require("joi-password-complexity")
const Joi = require("joi")
const validate = (data) => {
    const schema = Joi.object().keys({
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


module.exports = router
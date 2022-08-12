const router = require("express").Router()

// index.js de 3.no ile birlikte
router.get("/test", (req,res) => {
    res.send("auth works")
})

// 6
//postman de {"email":"ali@g.com", "password": "123"} gibi dene
const { User } = require("../models/User");
router.post("/signup", async(req,res) => {
    const { value, error } = validate(req.body);
    if (error) { //validation error
        res.status(422).send(error.details[0].message);
        console.log(error)
    } else { //validation PASS
        console.log(value)
        const user = await User.findOne({ email:req.body.email }) //user exist ?
        if(user) { //user vardı
            console.log("Bu kullanıcı zaten var")
            return res.status(401).send("Bu kullanıcı zaten var" )
        } else { //yeni user yani DB ye kaydet
            try {
                // save to MongoDB
                const { password, email } = value // const { password, email } = validate(req.body).value
                const newUser = new User({
                    email: email,
                    password: password
                })
                const savedUser = await newUser.save()
                res.status(201).json(savedUser)
                //console.log("savedUser: "+savedUser) //yukarıdakinin işini bitirmesini bekledikten sonra yazmaya çalışır
            } catch(err){
                console.log("err: "+err)
                res.status(500).json(err)
            }
        }

        //res.send("auth works") //dikkat et 1 req için 1 res göndrebilirsin
    }
})
const passwordComplexity = require("joi-password-complexity")
const Joi = require("joi");
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
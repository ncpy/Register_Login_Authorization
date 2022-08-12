const router = require("express").Router()

// index.js de 3.no ile birlikte
router.get("/test", (req,res) => {
    res.send("auth works")
})

// 6
//postman de {"email":"ali@g.com", "password": "123"} gibi dene
const { User, validate } = require("../models/User");
const CryptoJS = require("crypto-js")
router.post("/signup", async(req,res) => {
    const { value, error } = validate(req.body);
    if (error) { //validation error
        console.log(error)
        return res.status(422).send(error.details[0].message);
    } //hata yok yani validation PASSed
    
    // kullanıcı adı alınmış mı
    const userN = await User.findOne({ username:req.body.username })
    if(userN) {
        console.log("Kullanıcı adı alınmış")
        return res.status(401).send("Kullanıcı adı alınmış" )
    } 

    // email alınmış mı
    const user = await User.findOne({ email:req.body.email }) //user exist ?
    if(user) { //user vardı
        console.log("Bu kullanıcı zaten var")
        return res.status(401).send("Bu kullanıcı zaten var" )
    }
    
    //yeni user yani DB ye kaydet
    try {
        const { password, email } = value // const { password, email } = validate(req.body).value
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            email: req.body.email,
            password: CryptoJS.AES.encrypt(req.body.password, process.env.PASSPHRASE_SECRET).toString()
        })
        const savedUser = await newUser.save()
        console.log("savedUser: "+savedUser)
        res.status(201).json(savedUser)
    } catch(err){
        console.log("err: "+err)
        res.status(500).json(err)
    }

        //res.send("auth works") //dikkat et 1 req için 1 res göndrebilirsin
    
})


module.exports = router
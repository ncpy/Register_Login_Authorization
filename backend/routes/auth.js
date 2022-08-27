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

        // + 10
        const JWT = require("jsonwebtoken")
        const accessToken = await JWT.sign(
            { id: savedUser._id, }, //id: => savedUser or newUser or no need here 
            process.env.JWT_ACCESS_TOKEN_KEY, 
            { expiresIn: "30s" }) // token valid for 30s

        const refreshToken = await JWT.sign(
            { id: savedUser._id,}, //id: => savedUser or newUser or no need here 
            process.env.JWT_REFRESH_TOKEN_KEY, 
            { expiresIn: "3d" }) // token valid for 3days

        console.log("accessToken: ",accessToken)
        console.log("refreshToken: ",refreshToken)

    } catch(err){
        console.log("err: "+err)
        res.status(500).json(err)
    }

        //res.send("auth works") //dikkat et 1 req için 1 res göndrebilirsin
    
})

// tüm kullanıcıları GETir (get olduğu için localhost:5000/auth/alluser a da bak)
router.get("/alluser", async (req,res) => {
    try {
        const users = await User.find()
        console.log(users)
        res.status(200).json(users)
    } catch (error) {}
})

router.post("/login", async (req,res) => {
    const user = await User.findOne({ email: req.body.email })
    if(!user) {
        console.log("Geçersiz giriş.. Invalid credentials")
        return res.status(401).send("Geçersiz giriş.." )
    }
    
    //parola kontrolü de gerekli deşifre ederek..
    const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASSPHRASE_SECRET);
    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8)
    if(OriginalPassword !== req.body.password) {
        console.log("Geçersiz giriş.. wrong credentials!")
        return res.status(401).json("Geçersiz giriş..")
    }
    
    console.log("Login yaptınız ", user) // email ve parolaya bakarak
    console.log("OriginalPassword: "+OriginalPassword)
    //res.status(200).send("LOGGED IN.: \n\n"+user) //yoruma al aşağıdaki res ile çakışmasın!

    //accessToken her login veya singup yapıldığında üretilir.
    //refreshToken ise accessToken ın süresi bitiğinde yeni bir accessToken üretmeye yarar.
    //refreshToken ın süresi bittiğinde ise kullanıcıdan tekrar sisteme girişi istenir.
    const JWT = require("jsonwebtoken")
    const accessToken = await JWT.sign(
        { id: user._id, }, 
        process.env.JWT_ACCESS_TOKEN_KEY, 
        { expiresIn: "30s" }) 

    const refreshToken = await JWT.sign(
        { id: user._id,}, 
        process.env.JWT_REFRESH_TOKEN_KEY, 
        { expiresIn: "3d" }) 

    console.log("accessToken: ",accessToken)
    console.log("refreshToken: ",refreshToken)

    return res.status(200).json({accessToken,refreshToken} )
    
    
})


module.exports = router
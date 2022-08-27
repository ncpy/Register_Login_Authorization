const router = require("express").Router()
const generateToken = require("../utils/generateTokens")
const generateCookies = require("../utils/generateCookies");

// index.js de 3.no ile birlikte
router.get("/test", (req,res) => {
    res.send("auth works")
})

// 6
//postman de {"email":"ali@g.com", "password": "123"} gibi dene
const { User, validate } = require("../models/User");
const CryptoJS = require("crypto-js");
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

        //access ve refreshtoken oluşturmak için
        const { accessToken, refreshToken } = generateToken(savedUser._id)
        
        //refresh token ı çerezlere(cookie) gönder
        generateCookies(res, refreshToken) 
        
        return res.status(200).json({ accessToken,refreshToken })

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

    //access ve refreshtoken oluşturmak için
    const { accessToken, refreshToken } = await generateToken(user._id)

    //refresh token ı çerezlere(cookie) gönder
    const cerez = generateCookies(res, refreshToken)
    console.log("çerez: ",cerez.req.cookies)

    

    return res.status(200).json({ //to client
        _id: user._id,
        username: user.username,
        email: user.email,
        accessToken: accessToken,
        refreshToken: refreshToken,
    }) 

})

router.post("/logout", async (req,res) => {

    const cookies = req.cookies
    if (!cookies.cookieRefTkn) {
        console.log("token/çerez bulunamadı")
        return res.status(200).json("token/çerez bulunamadı") //no content
    }
    
    res.clearCookie("cookieRefTkn") //veya ..{ httpOnly:true, secure:true } ile birlikte

    console.log("Logged OUT")
    res.status(200).json("LOGGED OUT")

})


module.exports = router
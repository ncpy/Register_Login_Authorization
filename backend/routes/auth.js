const router = require("express").Router()
const generateToken = require("../utils/generateTokens")
const generateCookies = require("../utils/generateCookies");
const { PasswordReset } = require("../models/PasswordReset")
const nodemailer = require("nodemailer")
const { v4: uuidv4 } = require("uuid")

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
        // kullanıcılar için default role = USER:2001
        // aslında frontend tarafında kullanıcıdan hangi rolü olması istenmeyecek..
        //..eğer admin gerekirse DB den güncellenebilir
        // aşağıdaki 2 satır kod belki postman tarafında kolaylık için gerekir
        // production modunda silinebilir.
        // .env den integer değer için önüne + koyulabilir
        let roles = req.body.roles || []
        roles = roles?.includes(+process.env.ROLES_USER) 
                  ? roles 
                  : roles.concat(+process.env.ROLES_USER)
        
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            email: req.body.email,
            password: CryptoJS.AES.encrypt(req.body.password, process.env.PASSPHRASE_SECRET).toString(),
            roles: roles   //2001  prod. modunda sadece USER yeterli.
        })
        const savedUser = await newUser.save()
        console.log("savedUser: " + savedUser)

        //access ve refreshtoken oluşturmak için
        //? await çok önemli.. generateToken fonk. async ile çalıştığı için
        const { accessToken, refreshToken } = await generateToken(savedUser._id, savedUser.roles)
        
        //refresh token ı çerezlere(cookie) gönder
        const cerez = generateCookies(res, refreshToken) 
        console.log("çerez: ",cerez?.req?.cookies)
        
        return res.status(200).json({ accessToken,refreshToken })

    } catch(err){
        console.log("err: "+err)
        res.status(500).json(err)
    }
    
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
    const { accessToken, refreshToken } = await generateToken(user._id, user.roles)

    //refresh token ı çerezlere(cookie) gönder
    const cerez = generateCookies(res, refreshToken)
    console.log("çerez: ",cerez.req.cookies)

    
    
    return res.status(200).json({ //to client
        _id: user._id,
        username: user.username,
        email: user.email,
        roles: user.roles,
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

router.post("/requestPsswrdReset", async (req,res) => {
    const { email, redirectUrl } = req.body

    const user = await User.find({ email })
    if (!user) {
        console.log("ilgili mailin hesabı bulunamadı")
        return res.status(400).send("ilgili mailin hesabı bulunamadı")
    } 
    
    /*if (!user[0].verified...)
        return res.json({ message: "Email daha doğrulanamadı. Maili kontrol ediniz" })*/


    const sendResetEmail = ( user, redirectUrl, res ) => {
        const resetString = uuidv4() + user[0]._id

        //console.log(user[0]._id)
        //console.log(user[0].email)

        // tüm pswd reset kayıtlarını sil
        PasswordReset.deleteMany({ userId: user[0]._id })
            .then(result => {   // Reset records deleted successfully, now send the email
                
                //mail options
                const mailOptions = {
                    from: process.env.AUTH_EMAIL,
                    to: user[0].email,
                    subject: "Şifre Sıfırlama",
                    html: `<p>Duyduk ki şifrenizi kaybetmişsiniz.</p><p>Endişelenmeyin ama aşağıdaki linki kullanabilirsiniz</p><p>Bu link <b>60 dk sonra geçersiz olacak</b><p><p>İlerlemek için <a href=${
                        redirectUrl + "/" + user[0]._id + "/" + resetString
                    }>buraya</a> tıklayın</p>`
                }

                //hash reset string
                const hashedResetString = CryptoJS.AES.encrypt(resetString, process.env.PASSPHRASE_SECRET).toString()
                if (!hashedResetString) {
                    return res.status(400).send("error while hashing..") 
                }

                const newPasswordReset = new PasswordReset({
                    userId: user[0]._id,
                    resetString: hashedResetString,
                    createdAt: Date.now(),
                    expiresAt: Date.now() + parseInt(process.env.EMAIL_VALID_EXP)
                })

                newPasswordReset.save()
                    .then(() => {
                        let transporter = nodemailer.createTransport({
                            service: 'Gmail',   
                            auth: {
                                user: process.env.AUTH_EMAIL,
                                pass: "awqymkvkagtimfnc", //process.env.AUTH_PASS
                            },
                            tls: {
                                rejectUnauthorized: false
                            }
                        })

                        transporter.verify((error, success) => {
                            if (error)
                                console.log(error)
                            else {
                                console.log("Ready for message")
                                console.log(success)
                            }
                        })

                        transporter.sendMail(mailOptions)
                            .then(() => {
                                res.status(200).send("şifre sıfırlama emaili gönderildi.")
                            })
                            .catch(err => {
                                console.log(err)
                                return res.status(400).send("Şifre sıfırlama email başarısız")

                            })
                    })
                    .catch(err => {
                        console.log(err)
                        return res.status(400).send("Şifre sıfırlama kaydedilemedi")
                    })




            })
            .catch(err => {
                console.log(err)
                return res.status(400).send("Şifre sıfırlama geçmişi başarısız")
            })
    }

    //console.log("user::: ",user)
    sendResetEmail(user, redirectUrl, res)

})

//şifreyi sıfırlama
router.post("/resetPassword", async (req,res) => {
    let { userId, resetString, newPassword } = req.body

    PasswordReset.find({ userId })
        .then(result => {
            if (result.length > 0){
                const { expiresAt } = result[0]
                
                if (expiresAt < Date.now()) //sıfırlama tokenının zamanı geçtiyse
                    PasswordReset.deleteOne({ userId })
                        .then(() => {   //sıfırlama kaydı silindi
                            return res.status(400).send("Şifre sıfırlama linki geçersiz")
                        })
                        .catch(err => { //kayıt silme başarısız
                            console.log(err)
                            return res.status(400).send("Şifre sıfırlama isteği kaydı silinmesi başarısız")
                        })
                else { //geçerli sıfırlama kaydı mevcut
                    console.log("DEVAM ", result[0])    

                                        
                    const originalPassword = CryptoJS.AES.decrypt(result[0].resetString, process.env.PASSPHRASE_SECRET).toString(CryptoJS.enc.Utf8)                    
                    
                    console.log("DEVAM ", originalPassword)    
                    
                    if (originalPassword === resetString ) { // eşleşme başarılı
                        const hashednewPasswords = CryptoJS.AES.encrypt(newPassword, process.env.PASSPHRASE_SECRET).toString() //yeni parolayı kriptola..
                        if (!hashednewPasswords) {
                            return res.status(400).send("error while hashing..") 
                        }

                        //? id mi email mi 
                        User.updateOne({ _id: userId }, { password: hashednewPasswords })
                            .then(() => {   
                                // update başarılı. 
                                
                                //Şimdi sıfırlama kaydını sil
                                PasswordReset.deleteOne({ userId })
                                    .then(() => {   //kullanıcı kaydı ve sıfırlama kaydı silindi
                                        return res.status(200).send("BAŞARILI sıfırlama kaydı silindi") 
                                    })
                                    .catch(err => {
                                        console.log(err)
                                        return res.status(400).send("sıfırlama kaydını silinirken hata") 
                                    })

                            }) 
                            .catch(err => {
                                console.log(err)
                                return res.status(400).send("kullanıcı parola güncelleme başarısız") 
                            })

                    } else
                        return res.status(400).send("Eşleşme başarısız")
                        
                }
            } else  
            return res.status(400).send("Şifre sıfırlama isteği bulunamadı")

        })
        .catch(err => {
            console.log(err)
            return res.status(400).send("Mevcut şifreyi sıfırlama başarısız")
        })

})


module.exports = router
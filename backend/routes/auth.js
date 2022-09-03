const router = require("express").Router()
const generateToken = require("../utils/generateTokens")
const generateCookies = require("../utils/generateCookies");
const { PasswordReset } = require("../models/PasswordReset")
const { v4: uuidv4 } = require("uuid")
const { User, validate } = require("../models/User");
const CryptoJS = require("crypto-js");
const { UserVerification } = require("../models/UserVerification");
const mailTransporter = require("../utils/mailTransporter");

// index.js de 3.no ile birlikte
router.get("/test", (req,res) => {
    res.send("auth works")
})

//kayıt ol
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
            roles: roles,   //2001  prod. modunda sadece USER yeterli.
            verified: false
        })
        const savedUser = await newUser.save()
        console.log("savedUser: " + savedUser)

        sendVerificationEmail(savedUser, res)

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

// kullanıcı email doğrulama
const sendVerificationEmail = ({ _id, email }, res) => {
    const currentUrl = "http://localhost:3000"

    const uniqueString = uuidv4() + _id

    //mail options
    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Mailini Doğrula",
        html: `<p>Kayıt ve Giriş işlemleri için lütfen mailinizi doğrulayınız.</p><p>Bu link <b>60dk sonra geçersiz olacaktır.</b></p><p>İlerlemek için <a href=${currentUrl + "/verify/" + _id + "/" + uniqueString} >buraya</a> tıklayınız</p>`
    }

    //hash the uniquesString
    const hashedUniquesString = CryptoJS.AES.encrypt(uniqueString, process.env.PASSPHRASE_SECRET).toString()
    if (!hashedUniquesString) {
        console.log("error while hashing..")
        //return res.status(400).send("error while hashing..") 
    }

    const newVerification = new UserVerification({
        userId: _id,
        uniqueString: hashedUniquesString,
        createdAt: Date.now(),
        expiresAt: Date.now() + parseInt(process.env.EMAIL_VALID_EXP)
    })

    newVerification.save()
        .then(() => {
            mailTransporter(mailOptions, "Email doğrulama linki gönderildi.")
        })
        .catch(err => {
            console.log("Doğrulama email verisi kaydedilemedi:\n", err)
            //return res.status(400).send("Doğrulama email verisi kaydedilemedi")
        })

}

//email doğrula
router.get("/verify/:userId/:uniqueString", async (req,res) => {
    let { userId, uniqueString } = req.params  //? neden params kullanıldı neden req.body değil
    
    UserVerification.find({ userId })
        .then(result => {
            if (result.length > 0) { // kullanıcı doğrulama kaydı mevcut
                const { expiresAt } = result[0]

                if (expiresAt < Date.now()) {//sıfırlama tokenının zamanı geçtiyse, SİL
                    UserVerification.deleteOne({ userId })
                    .then(result => {   
                        //sıfırlama kaydı silindi

                        User.deleteOne({ _id: userId })     //kullanıcı da boşuna yer kaplamasın eğer ki emailini doğrulayamıyorsa.
                            .then(() => {
                                console.log("Link geçersiz. Lütfen tekrar kaydolun")
                                return res.status(400).send("Link geçersiz. Lütfen tekrar kaydolun")
                            })
                            .catch(err => {
                                console.log(err)
                                return res.status(400).send("Şifre sıfırlama linki geçersiz")
                            })

                    })
                    .catch(err => { //kayıt silme başarısız
                        console.log(err)
                        return res.status(400).send("Email doğrulama isteği kaydı silinmesi başarısız")
                    })
                
                } else {    //GEÇERLİ doğrulama kayıt var
                    const originalUniqueString = CryptoJS.AES.decrypt(result[0].uniqueString, process.env.PASSPHRASE_SECRET).toString(CryptoJS.enc.Utf8)                    
                    if (originalUniqueString === uniqueString ) { // eşleşme başarılı
                        
                        User.updateOne({ _id: userId }, { verified: true })
                            .then(() => {   
                                // update başarılı. 
                                return res.status(200).send("Doğrulama BAŞARILI \nDoğrulama email kaydı silindi") 
                                
                                //Şimdi doğrulama kaydını sil
                                UserVerification.deleteOne({ userId })
                                    .then(() => {   //email doğrulama kaydı ve sıfırlama kaydı silindi
                                        return res.status(200).send("Doğrulama BAŞARILI \nDoğrulama email kaydı silindi") 
                                    })
                                    .catch(err => {
                                        console.log(err)
                                        return res.status(400).send("doğrulama email kaydını silinirken hata") 
                                    })

                            }) 
                            .catch(err => {
                                console.log(err)
                                return res.status(400).send("kullanıcı email doğrulama başarısız") 
                            })

                    } else
                        return res.status(400).send("Eşleşme başarısız")
                }

            } else {    // kullanıcı doğrulama kaydı mevcut değil
                let message = "Hesap kaydı bulunamadı(Kaydol) veya hesap doğrulanmış(Giriş Yap)."
                res.redirect(`/verified/error=true&message=${message}`)
            }
        })
        .catch(err => {
            console.log(err)
            let message = "Kullanıcı doğrulama kaydı hata"
            res.redirect(`/verified/error=true&message=${message}`)
            //return res.status(400).send("Kullanıcı doğrulama kaydı hata")
        })
})

//doğrulanmış sayfa yönlendirmesi
router.get("/verified", async (req,res) => {
    res.status(200).json("DOĞRULAMA BAŞARILI. Bu başarıyı LinkedIN de paylaşmalısın:))")
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

    //kullanıcı doğrulama yapmış mı
    if (!user.verified) {
        return res.status(400).json("Email henüz doğrulanmadı. Lütfen mailinizi kontrol edin")
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
    
    if (!(user[0]?.verified))
        return res.status(400).send("Email daha doğrulanamadı. Maili kontrol ediniz")


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
                        return mailTransporter(mailOptions, "şifre sıfırlama emaili gönderildi.")
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

    res.status(200).json("helllo")

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
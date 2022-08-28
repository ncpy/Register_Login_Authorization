const router = require("express").Router()
const JWT = require("jsonwebtoken")
const verifyRefreshToken = require("../utils/verifyRefreshToken")


// http://localhost:5000/refreshTkn
router.get("/", async (req, res) => {
    
    //yani refresh token ı çağırmalıyız(request)
    //en sağlam yollardan biri de httpOnly destekli cookie ler aracılığıyla refresh token ı almaktır.
    const refreshToken = req.cookies?.cookieRefTkn

    if(!refreshToken)
        return res.send("refresh token yok")
    
    verifyRefreshToken(refreshToken)       //? req.body.refreshToken
    .then(({tokenDetails}) => {
        const accessToken = JWT.sign(
            { _id: tokenDetails._id, roles: tokenDetails.roles },
            process.env.JWT_ACCESS_TOKEN_KEY,
            { expiresIn: process.env.JWT_ACCESS_EXP }
        )

        res.status(200).json({
            error: false, 
            accessToken,
            message:"Access token oluşturuldu"
        })
    })
    .catch(err => res.status(400).json(err))

})

module.exports = router
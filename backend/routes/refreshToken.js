const router = require("express").Router()
const JWT = require("jsonwebtoken")


// http://localhost:5000/refreshTkn
router.get("/", async (req, res) => {
    
    //yani refresh token ı çağırmalıyız(request)
    //en sağlam yollardan biri de httpOnly destekli cookie ler aracılığıyla refresh token ı almaktır.
    const { refreshToken } = req.body

    if(!refreshToken)
        return res.send("refresh token yok")
    
    JWT.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_KEY, (err, tokenDetails) => {
        if(err)
            return res.send("doğrulanamadı")
        
        const accessToken = JWT.sign(
            {},//buraya normalde id/role gibi bilgiler eklenmeli
            process.env.JWT_ACCESS_TOKEN_KEY,
            { expiresIn: "30s" }
        )

        res.send({accessToken})
    })

})

module.exports = router
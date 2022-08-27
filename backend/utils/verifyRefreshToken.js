const JWT = require("jsonwebtoken")

const verifyRefreshToken = (ref_token) => {
  
    return new Promise((resolve, reject) => {
        JWT.verify(ref_token, process.env.JWT_REFRESH_TOKEN_KEY, (err, tokenDetails) => {
            if(err)
                return reject("geçersiz refresh token" )
            
            resolve({
                tokenDetails,
                message: "GEÇERLİ refresh token"
            })
        })
    })
}

module.exports = verifyRefreshToken
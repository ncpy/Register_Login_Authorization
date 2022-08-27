const generateCookies = (res, refreshToken) => {
    const options = {
        httpOnly: process.env.NODE_ENV === "production" ? true : false,
        secure: process.env.NODE_ENV === "production" ? true : false,
        expires: new Date(Date.now() + 30000) // + //parseInt(process.env.JWT_EXPIRATION_NUM))
        /*path: '/refresh_token'*/ 
    }
    return res.cookie("cookieRefTkn", refreshToken, options)
}

module.exports = generateCookies
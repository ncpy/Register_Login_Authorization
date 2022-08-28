const generateCookies = (res, refreshToken) => {
    const options = {
        httpOnly: process.env.NODE_ENV === "production" ? true : false,
        secure: process.env.NODE_ENV === "production" ? true : false,
        expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXP))
        /*path: '/refresh_token'*/ 
    }
    return res.cookie("cookieRefTkn", refreshToken, options)
}

module.exports = generateCookies
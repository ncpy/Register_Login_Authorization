const JWT = require("jsonwebtoken")

module.exports = async (req, res, next) => {
    const authorization = req.headers['rasoftauthorization'] //veya req.header('..') // istenilen headers yazılabilir ama belli kuralları var, hepsi küçük(??) gibi
    if (!authorization)
        return res.status(400).json("LOG IN gerekir")

    // Bearer s23litrfbgscsdkfsdhj2t3rıwodgdhıob6gr
    const token = authorization.split(' ')[1]

    if(!token)
        return res.status(400).json("Token bulunamadı")

    try {
        const tokenDetails = await JWT.verify(token, process.env.JWT_ACCESS_TOKEN_KEY)
        req.user = tokenDetails

        next() // sonraki adıma geçmesini sağlar(middleware den çıkarak)
    } catch (error) {
        return res.status(400).json("Token GEÇERSİZ.")
        
    }

}
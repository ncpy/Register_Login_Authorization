const JWT = require("jsonwebtoken")

//accessToken her login veya singup yapıldığında üretilir.
//refreshToken ise accessToken ın süresi bitiğinde yeni bir accessToken üretmeye yarar.
//refreshToken ın süresi bittiğinde ise kullanıcıdan tekrar sisteme girişi istenir.    
const generateTokens = async(id) => {
  try {
    const accessToken = await JWT.sign(
        { id: id, }, 
        process.env.JWT_ACCESS_TOKEN_KEY, 
        { expiresIn: "10s" }) 

    const refreshToken = await JWT.sign(
        { id: id,}, 
        process.env.JWT_REFRESH_TOKEN_KEY, 
        { expiresIn: "30s" }) 

    console.log("accessToken: ",accessToken)
    console.log("refreshToken: ",refreshToken)

    //Promise, callback’lerin sıkıntılı yönlerini düzeltmek amacıyla önerilmiş bir yapıdır.
    //detay için: https://medium.com/codefiction/javascriptte-promise-kullan%C4%B1m%C4%B1-ccca1123989a
    return Promise.resolve({ accessToken, refreshToken })
    
  } catch (error) {
    return Promise.reject(error) 
  }
}

module.exports = generateTokens;
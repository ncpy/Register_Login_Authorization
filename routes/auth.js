const router = require("express").Router()

// index.js de 3.no ile birlikte
router.get("/test", (req,res) => {
    res.send("auth works")
})

// 5
router.post("/signup", (req,res) => {
    const { password, email } = req.body
    console.log(password, email) 
    //if (password.length <6)...  => use 3rd part lib. like jio/express-validator
    res.send("auth works")
})

module.exports = router
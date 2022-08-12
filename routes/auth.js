const router = require("express").Router()

// index.js de 3.no ile birlikte
router.get("/test", (req,res) => {
    res.send("auth works")
})

// 4
// postmanda localhost:5000/auth/signup POST yapılırsa çıktı görünür
router.post("/signup", (req,res) => {
    res.send("auth works")
})

module.exports = router
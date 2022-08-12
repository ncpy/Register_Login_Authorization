const router = require("express").Router()

// index.js de 3.no ile birlikte
router.get("/test", (req,res) => {
    res.send("auth works")
})



module.exports = router
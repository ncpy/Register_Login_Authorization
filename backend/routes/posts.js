const router = require("express").Router()
const checkAuth = require("../middleware/checkAuth")
const roleCheck = require("../middleware/roleCheck")

publicPosts = [
    {title:"Free Post 1", desc:"Detaylar"},
    {title:"Free Post 2", desc:"Detaylar"},
    {title:"Free Post 3", desc:"Detaylar"},
]

paidPosts = [
    {title:"Paid Post 1", desc:"Detaylar"},
    {title:"Paid Post 2", desc:"Detaylar"},
    {title:"Paid Post 3", desc:"Detaylar"},
]

// herkese açık postlar
// http://localhost:5000/posts/public
router.get("/public", (req, res) => {
    res.json(publicPosts)
})

// özel erişimli postlar
// http://localhost:5000/posts/private
/*router.get("/private", checkAuth, (req,res) => {
    res.json(paidPosts)
})*/

// role bazlı yetkilendirme 2
router.get("/private", checkAuth, roleCheck([1001]), (req,res) => {
    res.json(paidPosts)
})

module.exports = router;
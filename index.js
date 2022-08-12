const express = require("express")
const app = express()

//localhost:5000/ adresine gidince ekranda görünen;
app.get("/", (req,res) => {
    res.send("We did it")
})

// 2 bunun gibi onlarca post get put metodları yazılabilir ama 
//burada kalabalık görüntü vermemek adına ROUTES klasörü oluşturp 
//buradan oraya erişim sağlamaya çalışacağız --> 3. noya bak
//app.post("/sign")

// 3 =>1 ile 3 birlikte
// localhost:5000/auth/test adresine gidilirse sonuç;
const auth = require("./routes/auth")
app.use("/auth", auth)












app.listen(5000, () => {
    console.log("backend çalışıyor.")
})
const express = require("express")
const app = express()

//localhost:5000/ adresine gidince ekranda görünen;
app.get("/", (req,res) => {
    res.send("We did it")
})

// 5 --> postman de JSON yazmadan gönderin UNDEFINED
// json body {username..,pass..} data ile post edilince sonuç verir
const auth = require("./routes/auth")
app.use(express.json())
app.use("/auth", auth)












app.listen(5000, () => {
    console.log("backend çalışıyor.")
})
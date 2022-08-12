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


const dotenv = require("dotenv")
dotenv.config()
const mongoose = require("mongoose")
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("DB connected"))
    .catch((err) => console.log(err))



app.listen(process.env.PORT || 5000, () => {
    console.log("backend çalışıyor.")
})
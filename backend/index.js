const express = require("express")
const app = express()

// frontend to backend
const cors = require('cors');
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true       //! cookie için allowcredentials falan true olması gerekribir bi yerlerde??
}));

//localhost:5000/ adresine gidince ekranda görünen;
app.get("/", (req,res) => {
    res.send("We did it")
})

app.use(express.json())
app.post("/", async (req,res) => {
    console.log(req)
    res.send(req.body)
})

// later cookie & csrf(not now)
const cookieParser = require("cookie-parser")
app.use(cookieParser())

// 5 --> postman de JSON yazmadan gönderin UNDEFINED
// json body {username..,pass..} data ile post edilince sonuç verir
const auth = require("./routes/auth")
app.use(express.json())
app.use("/auth", auth)

//refresh token route
const refreshToken = require("./routes/refreshToken")
app.use("/refreshTkn", refreshToken)

//rol bazlı yetkilendirme
const posts = require("./routes/posts")
app.use("/posts", posts)


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
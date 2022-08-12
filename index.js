const express = require("express")
const app = express()

//localhost:5000/ adresine gidince ekranda görünen;
app.get("/", (req,res) => {
    res.send("We did it")
})

app.listen(5000, () => {
    console.log("backend çalışıyor.")
})
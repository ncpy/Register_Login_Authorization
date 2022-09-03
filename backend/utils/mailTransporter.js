const nodemailer = require("nodemailer")

const mailTransporter = (mailOptions, message) => {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',   
        auth: {
            user: process.env.AUTH_EMAIL,
            pass: "awqymkvkagtimfnc", //process.env.AUTH_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    })

    transporter.verify((error, success) => {
        if (error)
            console.log(error)
        else {
            console.log("Ready for message: ", success)
        }
    })

    transporter.sendMail(mailOptions)
        .then(() => {
            console.log(message)
            //res.status(200).send(message)
        })
        .catch(err => {
            console.log(err)
            //return res.status(400).send("Email doğrualama linki başarısız")
        })

    return transporter
}

module.exports = mailTransporter
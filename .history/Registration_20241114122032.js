var express = require('express');
var app = express();
const mysql = require("mysql");
const nodemailer = require('nodemailer');



///conectwith databse
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospitalnodebackend',

});
connection.connect((error) => {
    if (error) {
        console.error('error database connecting')
        return;
    }
    console.log('connected' + connection.threadId);
});
////

const otpStore = {};
const connection = require('./ 	hospitalnodebackend');

function generateOtp() {

    return Math.floor(100000 + Math.random() * 900000).toString();
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/sendotp', (req, res) => {
    const { Email } = req.body;
    if (!Email) {
        return res.status(400).send({ error: "Email is required" });
    }
    const OTP = generateOtp();
    otpStore[Email] = OTP;
    console.log(`Generated OTP for ${Email}: ${OTP}`);
});

var transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'jasiljazz679@gmail.com',
        pass: 'bpyn bndd yhan atwo'
    }
});
message = {
    from: "jasiljazz679@gmail.com",
    to: Email,
    subject: "Subject",
    text: `Your OTp is: ${ OTP }`

}
transport.sendMail(message, (err, info) => {
    if (err) {
        console.error("Error sending OTP:", err);
        return res.status(500).send({ error: "Failed to send OTP" });
    }
    console.log("OTP sent:", info.response);
    res.status(200).send({ message: "OTP sent to your email" });
});




app.listen(3000);
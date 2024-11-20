var express = require('express');
var app = express();
const mysql = require("mysql");
const nodemailer = require('nodemailer');
const session = require('express-session');
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


    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'jasiljazz679@gmail.com',
            pass: 'bpyn bndd yhan atwo'
        }
    });

    const message = {
        from: 'jasiljazz679@gmail.com',
        to: Email,
        subject: 'Your OTP Code',
        text: `Your OTP is: ${OTP}`
    };

    transport.sendMail(message, (err, info) => {
        if (err) {
            console.error("Error sending OTP:", err);
            return res.status(500).send({ error: "Failed to send OTP" });
        }
        console.log("OTP sent:", info.response);
        res.status(200).send({ message: "OTP sent to your email" });
    });
});


const verifyOtp = (Email, OTP) => {
    if (otpStore[Email] !== parseInt(OTP)) {
        return false;
    }
    delete otpStore[Email];
    return true;
};


app.post('/signin', (req, res) => {
    const { username, Email, password, OTP } = req.body;

    if (!username || !Email || !password || !OTP || !Email) {
        return res.status(400).send({ error: "All fields and OTP are required" });
    }


    const isOtpValid = verifyOtp(Email, OTP);
    if (!isOtpValid) {

        return res.status(400).send({ error: "Invalid OTP" });
    }


    connection.query(
        'INSERT INTO signin( username, Email, password, OTP) VALUES (?, ?, ?, ?)', [username, Email, password, OTP],
        (error, results) => {
            if (error) {
                console.error("Error inserting data:", error);
                return res.status(500).send({ error: "Database error" });
            }
            res.status(200).send({ message: "User registered successfully", results });
        }
    );
});
app.listen(3000);
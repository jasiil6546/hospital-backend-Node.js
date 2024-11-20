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

function generateOtp() {

    return Math.floor(100000 + Math.random() * 900000).toString();
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.post('/insert', (req, res) => {
//     const { User_Name, Name, Age, phone, Email, Gender, Category, Departement } = req.body;
//     console.log(User_Name, Name, Age, phone, Email, Gender, Category, Departement);
//     const OTP = generateOtp();

//     connection.query('INSERT INTO registrations(User_Name,Name,Age,phone,Email,Gender,Category,Departement) VALUES (?,?,?,?,?,?,?,?)', [User_Name, Name, Age, phone, Email, Gender, Category, Departement], (error, results) => {
//         if (error) {
//             console.error("Error posting");
//             return
//         }
//         res.send(results);
//     });

//     var transport = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: 'jasiljazz679@gmail.com',
//             pass: 'bpyn bndd yhan atwo'
//         }
//     });
//     message = {
//         from: "jasiljazz679@gmail.com",
//         to: Email,
//         subject: "Subject",
//         text: `Your OTp is: ${ OTP }`

//     }
//     transport.sendMail(message, function(err, info) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log(info);
//             res.send("verifcation otp sended")
//         }
//     });
// });

app.post('/sendotp', (req, res) => {
    console.log(req.body); // Log the incoming body to check its structure

    const { Email } = req.body;

    if (!Email) {
        return res.status(400).json({ error: "Email is required" });
    }

    const OTP = generateOtp();
    otpStore[Email] = OTP; // Store the OTP using email as the key
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
            return res.status(500).json({ error: "Failed to send OTP" });
        }
        console.log("OTP sent:", info.response);
        res.status(200).json({ message: "OTP sent to your email" });
    });
});

{
    "error": "All fields and OTP are required"
}
app.listen(3000);
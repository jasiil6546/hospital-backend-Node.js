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

app.post('/register', (req, res) => {
    const { User_Name, Name, Age, phone, Email, Gender, Category, Departement, otp } = req.body;

    // Log incoming data for debugging
    console.log("Received data:", req.body);
    console.log("Stored OTPs:", otpStore);

    // Check if all fields are provided
    if (!User_Name || !Name || !Age || !phone || !Email || !Gender || !Category || !Departement || !otp) {
        return res.status(400).json({ error: "All fields and OTP are required" });
    }

    // Check if OTP exists for the given email
    if (!otpStore[Email]) {
        console.log(`No OTP found for email: ${Email}`);
        return res.status(400).json({ error: "OTP not found for this email" });
    }

    // Verify the OTP (ensure it's compared as a string)
    if (otpStore[Email] !== otp) {
        console.log(`Invalid OTP for ${Email}. Received: ${otp}, Expected: ${otpStore[Email]}`);
        return res.status(400).json({ error: "Invalid OTP" });
    }

    // If OTP is correct, register the user
    connection.query(
        'INSERT INTO registrations (User_Name, Name, Age, phone, Email, Gender, Category, Departement) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [User_Name, Name, Age, phone, Email, Gender, Category, Departement],
        (error, results) => {
            if (error) {
                console.error("Error inserting data:", error);
                return res.status(500).json({ error: "Database error" });
            }
            res.status(200).json({ message: "User registered successfully", results });

            // Remove the OTP after successful registration
            delete otpStore[Email];
        }
    );
});
app.listen(3000);
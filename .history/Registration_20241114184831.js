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

    // Log the request body for debugging
    console.log("Received Request Body:", req.body);

    // Validate if any field is missing
    if (!User_Name || !Name || !Age || !phone || !Email || !Gender || !Category || !Departement || !otp) {
        return res.status(400).json({ error: "All fields and OTP are required" });
    }

    // Verify the OTP
    if (!otpStore[Email] || otpStore[Email] !== parseInt(otp)) {
        return res.status(400).json({ error: "Invalid OTP" });
    }

    // Insert user data into the hospitalbackend database
    connection.query(
        'INSERT INTO registrations (User_Name, Name, Age, phone, Email, Gender, Category, Departement) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [User_Name, Name, Age, phone, Email, Gender, Category, Departement],
        (error, results) => {
            if (error) {
                console.error("Error inserting data:", error);
                return res.status(500).json({ error: "Database error" });
            }
            res.status(200).json({ message: "User registered successfully", results });

            // Clean up the OTP after successful registration
            delete otpStore[Email];
        }
    );
});
app.listen(3000);
var express = require('express');
var app = express();
const mysql = require("mysql");
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
app.use(bodyParser.json());

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
//Send OTP to the user's email
app.post('/sendotp', (req, res) => {
    const { Email } = req.body;
    if (!Email) {
        return res.status(400).send({ error: "Email is required" });
    }

    // Generate OTP
    const OTP = generateOtp();
    otpStore[Email] = OTP; // Store the OTP with the email as key
    console.log(`Generated OTP for ${Email}: ${OTP}`);

    // Send OTP email
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

//verify OTP
const verifyOtp = (Email, OTP) => {
    if (otpStore[Email] !== parseInt(OTP)) {
        return false;
    }
    delete otpStore[Email];
    return true;
};

//register user after OTP verification
app.post('/register', (req, res) => {
    const { User_Name, Name, Age, phone, Email, Gender, Category, Departement, otp } = req.body;

    // Check if all required fields are present
    if (!User_Name || !Name || !Age || !phone || !Email || !Gender || !Category || !Departement || !otp) {
        return res.status(400).send({ error: "All fields and OTP are required" });
    }

    //Verify OTP
    const isOtpValid = verifyOtp(Email, OTP);
    if (!isOtpValid) {
        return res.status(400).send({ error: "Invalid OTP" });
    }

    //Insert user 
    connection.query(
        'INSERT INTO registrations(User_Name, Name, Age, phone, Email, Gender, Category, Departement) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [User_Name, Name, Age, phone, Email, Gender, Category, Departement],
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
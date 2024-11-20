const { text } = require('body-parser');
const express = require('express');
const mysql = require('mysql');
const app = express();
const nodemailer = require('nodemailer');
const session = require('express-session')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospitalnodebackend'
})
connection.connect((error) => {
    if (error) {
        console.error("error database connecting");
        return;
    }
    console.log('connected to MySQL database');
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 36000
    }
}))
app.post('/insert', (req, res) => {
    // const {email}=req.body;
    const { name, phone, email, username, password } = req.body;
    const OTP = Math.floor(100000 + Math.random() * 900000);
    console.log(OTP)
    var transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'jasiljazz679@gmail.com',
            pass: 'bpyn bndd yhan atwo'
        }
    });
    message = {
        from: 'jasiljazz679@gmail.com',
        to: email,
        subject: 'otp of your registration',
        text: `Your OTP is ${OTP}`
    };

    transport.sendMail(message, (err, info) => {
        if (err) {

            console.log(err)

        } else {
            req.session.user = {
                name: name,
                phone: phone,
                email: email,
                username: username,
                password: password,
                otp: OTP
            };
            console.log(info)
            res.json({ message: 'success' })
        }
    });
});

app.post("/register", (req, res) => {
    console.log("Session data:", req.session.user);
    const { Otp } = req.body;

    if (!req.session.user) {
        return res.status(400).json({ message: 'No session data found. Please request OTP first.' });
    }

    const { name, phone, email, username, password, otp } = req.session.user;
    console.log(otp);


    if (parseInt(Otp) === otp) {
        connection.query("INSERT INTO signin (name, phone, email, username, password) VALUES (?, ?, ?, ?, ?)", [name, phone, email, username, password], (error, result) => {
            if (error) {
                console.error('Error posting data:', error);
                return res.status(500).json({ message: 'Error saving user data' });
            }
            console.log(result);
            res.json({ message: 'User registered successfully' });
        });
    } else {
        res.json({ message: 'Invalid OTP' });
    }
});



app.listen(3000)
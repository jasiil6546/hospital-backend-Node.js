const { text } = require('body-parser');
const express = require('express');
const mysql = require('mysql');
const app = express();
const nodemailer = require('nodemailer');
const session = require('express-session')
const Admin = require('./Admin.js');
app.use('/Admin', Admin);

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
        maxAge: 60000
    }
}));
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
app.post('/login', (req, res) => {
    if (req.session.userid) {
        res.json({ message: "Already Logged In" })
    } else {
        const { username, password } = req.body;
        connection.query('select * from signin where username=? and Password=?', [username, password], (err, result) => {
            if (err) {
                console.log(err);
                res.json({ message: "Error" });

            }
            if (result.length > 0) {
                req.session.userid = username;
                res.json({ message: "Login success" });

            } else {
                res.json({ message: "Not registered" })
            }
        })
    }
});
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).send({ error: "Failed to destroy session" });
        } else {
            res.json({ message: "Logout Successfull" })
        }

    });
});
app.listen(3000)
const admin('/admin', './Admin.js ');
app.us
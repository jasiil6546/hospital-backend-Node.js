const { text } = require('body-parser');
const express = require('express');
const mysql = require('mysql');
const app = express();
const nodemailer = require('nodemailer');
const session = require('express-session')
const Admin = require('./Admin.js');
app.use('/Admin', Admin);
const generateToken = require('./tokenGenerator');
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
module.exports = connection;
////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
///////////////////////////////////////////////////////////////////////////////////////////////////////
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
///////////
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

////////////////////////////////////////////////////////////////////
function generateToken(prefix = 'DOC') {
    const timestamp = Date.now().toString();
    const randomString = crypto.randomBytes(3).toString('hex');
    return `${prefix}-${timestamp}-${randomString}`;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/booking', (req, res) => {
    const { Name, Age, phone, Email, Gender, Address } = req.body;
    const Token = generateToken('DOC');
    console.log(Name, Age, phone, Email, Gender, Address, Token);


    connection.query('INSERT INTO patients(Name, Age, phone, Email, Gender, Address,Token) VALUES (?,?,?,?,?,?,?)', [Name, Age, phone, Email, Gender, Address, Token], (error, results) => {
        if (error) {
            console.error('Error booking:', error);
            return res.status(500).json({ error: 'Database error, booking failed' });
        }
        res.status(201).json({
            message: 'Booking successful',
            Token: Token, // Include the generated token in the response
            data: results
        });
    });
});
//////delete booking
app.post('/delbooking', (req, res) => {
    const { phone } = req.body;
    console.log("Phone to delete:", phone);

    connection.query('DELETE FROM patients WHERE phone = ?', [phone], (error, results) => {
        if (error) {
            console.error('Error deleting booking:', error);
            return res.status(500).json({ error: 'Database error, deletion failed' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'No booking found with this phone number' });
        }

        res.status(200).json({ message: 'Booking deleted successfully' });
    });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.listen(3000);
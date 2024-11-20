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


////const app = express();

let otp; // Global variable to store the generated OTP

app.get('/send-otp', (req, res) => {

            otp = Math.floor(100000 + Math.random() * 900000).toString();

            const transport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });
            app.get('/sendmail', (req, res) => {
                var transport = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'jasiljazz679@gmail.com',
                        pass: 'bpyn bndd yhan atwo'
                    }
                });
                message = {
                    from: "jasiljazz679@gmail.com",
                    to: "m.jasilof@gmail.com",
                    subject: "Subject",
                    text: "Hello SMTP Email"
                }
                transport.sendMail(message, function(err, info) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(info);
                        res.send("email sended")
                    }
                });

            });



            app.listen(3000);
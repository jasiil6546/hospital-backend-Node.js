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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/insert', (req, res) => {
    const { name, age, phone } = req.body;
    console.log(name, age, phone);


    connection.query regi('INSERT INTO registrations(User_Name,Name,Age,phone,Email,Gender,Category,Departement) VALUES (?,?,?,?,?,?,?,?)', [name, age, phone], (error, results) => {
        if (error) {
            console.error("Error posting");
            return // res.status(500).send({ error: "Error posting data" });
        }
        res.send(results);
    });
});

























































/////
app.get('/sendotp', (req, res) => {
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
        text: "Your OTp is:${OTP}"
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
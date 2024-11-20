vvar express = require('express');
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

f
app.listen(3000);
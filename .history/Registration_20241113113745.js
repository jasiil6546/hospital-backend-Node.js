var express = require('express');
var app = express();


///conectwith databse
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'asusjs',

});
connection.connect((error) => {
    if (error) {
        console.error('error datase connecting')
        return;
    }
    console.log('connected' + connection.threadId);
});
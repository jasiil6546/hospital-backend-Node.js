var express = require('express')
var router = express.Router();
router.get('/', function(req, res) {
    res.send('Getvrute on things');
});
router.post('/', function(req, res) {
    res.send('postvrute on things');
});
module.exports = router;
/////
const mysql = require('mysql');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/insertdoc', (req, res) => {
    const { User_Name, Name, Age, phone, Email, Gender, Category, Duty_time } = req.body;
    console.log(User_Name, Name, Age, phone, Email, Gender, Category, Duty_time);


    connection.query('INSERT INTO doctors( User_Name, Name, Age, phone, Email, Gender, Category, Duty_time) VALUES (?,?,?,?,?,?,?,?)', [User_Name, Name, Age, phone, Email, Gender, Category, Duty_time], (error, results) => {
        if (error) {
            console.error("Error posting");
        }
        res.send(results);
    });
});
app.put('/update/doc', (req, res) => {
    const U = req.params.id;
    const { Name } = req.body;
    console.log(name);


    connection.query('UPDATE user SET name=? WHERE id=?', [Name, userId], (error, results) => {
        if (error) {
            console.error("Error posting");

        }
        res.send(results);  
    });
});
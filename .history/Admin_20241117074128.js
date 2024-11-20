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
const app = express();
const mysql = require('mysql');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/insertdoc', (req, res) => {
    const { Id, User_Name, Name, Age, phone, Email, Gender, Category, Duty_time } = req.body;
    console.log(Id, User_Name, Name, Age, phone, Email, Gender, Category, Duty_time);

    let tableName = '';
    if (Category === 'Doctor') {
        tableName = 'doctors';
    } else if (Category === 'Patient') {
        tableName = 'patients';
    } else {
        return res.status(400).json({ message: 'Invalid category' });
    }

    connection.query('INSERT INTO ${tableName}(Id,User_Name, Name, Age, phone, Email, Gender, Category, Duty_time) VALUES (?,?,?,?,?,?,?,?)', [Id, User_Name, Name, Age, phone, Email, Gender, Category, Duty_time], (error, results) => {
        if (error) {
            console.error("Error posting:", error);
            return res.status(500).json({ message: 'Database error' });
        }
        res.json({ message: 'Inserted successfully', results });
    });
});




app.put('/update/doc', (req, res) => {
    const doctorsId = req.params.id;
    const { Name } = req.body;
    console.log(Name);


    connection.query('UPDATE user SET doctorsId=? WHERE Name=?', [Name, doctorsId], (error, results) => {
        if (error) {
            console.error("Error posting");

        }
        res.send(results);
    });
});

app.delete('/delete/doc', (req, res) => {
    const doctorsId = req.params.id;

    connection.query('DELETE FROM doctors WHERE id=?', [doctorsId], (error, results) => {
        if (error) {
            console.error("Error deleting");

        }
        res.send(results);
    });
});
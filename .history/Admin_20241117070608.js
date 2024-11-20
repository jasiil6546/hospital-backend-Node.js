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
    const { Id, User_Name, Name, Age, phone, Email, Gender, Category, Duty_time } = req.body;



    connection.query('INSERT INTO doctors(Id,User_Name, Name, Age, phone, Email, Gender, Category, Duty_time) VALUES (?,?,?,?,?,?,?,?)', [Id, User_Name, Name, Age, phone, Email, Gender, Category, Duty_time], (error, results) => {
        if (error) {
            console.error("Error posting:", error);
            return res.status(500).json({ message: 'Database error', error });
        }

        return res.json({
            message: 'Doctor inserted successfully',
            affectedRows: results.affectedRows,
            insertId: results.insertId
        });
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
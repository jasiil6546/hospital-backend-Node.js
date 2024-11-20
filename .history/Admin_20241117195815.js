var express = require('express')
var router = express.Router();
module.exports = router;
const app = express();
const mysql = require('mysql');

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////ZZZZZZZZ
router.post('/insertdt', async(req, res) => {

    const { Id, User_Name, Name, Age, phone, Email, Gender, Category, Duty_time } = req.body;

    try {

        const connection = await pool.getConnection();


        let tableToJoin = '';
        if (Category === 'Doctor') {
            tableToJoin = 'doctors';
        } else if (Category === 'Nurse') {
            tableToJoin = 'nurse';
        } else if (Category === 'Staffs') {
            tableToJoin = 'staffs';
        } else {
            return res.status(400).json({ message: 'Invalid category' });
        }


        const [result] = await connection.query(`
        INSERT INTO registrations (Id, User_Name, Name, Age, phone, Email, Gender, Category, Duty_time, ${tableToJoin}_Id)
        SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, Id
        FROM ${tableToJoin}
        WHERE ${tableToJoin}.Id = ?`, [Id, User_Name, Name, Age, phone, Email, Gender, Category, Duty_time, Id]);


        connection.release();


        res.json({ message: 'Record inserted successfully', results: result });
    } catch (error) {

        console.error('Error inserting record:', error);
        res.status(500).json({ message: 'Database error' });
    }
});




router.put('/update/doc', (req, res) => {
    const doctorsId = req.params.id;
    const { Name } = req.body;
    console.log(Name);


    connection.query('UPDATE doctors SET doctorsId=? WHERE Name=?', [Name, doctorsId], (error, results) => {
        if (error) {
            console.error("Error posting");

        }
        res.send(results);
    });
});

router.delete('/delete/doc', (req, res) => {
    const doctorsId = req.params.id;

    connection.query('DELETE FROM doctors WHERE id=?', [doctorsId], (error, results) => {
        if (error) {
            console.error("Error deleting");

        }
        res.send(results);
    });
});

app.get('/displaydoc', (req, res) => {

    connection.query('SELECT * FROM doctors', (error, results) => {
        if (error) {
            console.error("Error fetching");
        }
        res.send(results);
    });
});
/////////////////////////////////////////////////////////router.put('/update/doc', (req, res) => {

router.put('/update/nr', (req, res) => {
    const Id = req.params.id;
    const { Name } = req.body;
    console.log(Name);


    connection.query('UPDATE nurse SET doctorsId=? WHERE Name=?', [Name, Id], (error, results) => {
        if (error) {
            console.error("Error posting");

        }
        res.send(results);
    });
});

router.delete('/delete/nur', (req, res) => {
    const Id = req.params.id;

    connection.query('DELETE FROM nurse WHERE id=?', [Id], (error, results) => {
        if (error) {
            console.error("Error deleting nurses");

        }
        res.send(results);
    });
});

app.get('/displaydoc', (req, res) => {

    connection.query('SELECT * FROM doctors', (error, results) => {
        if (error) {
            console.error("Error fetching");
        }
        res.send(results);
    });
});
//////////////////////////////////////////////////////////////////////////////////////////

router.put('/update/doc', (req, res) => {
    const doctorsId = req.params.id;
    const { Name } = req.body;
    console.log(Name);


    connection.query('UPDATE doctors SET doctorsId=? WHERE Name=?', [Name, doctorsId], (error, results) => {
        if (error) {
            console.error("Error posting");

        }
        res.send(results);
    });
});

router.delete('/delete/doc', (req, res) => {
    const doctorsId = req.params.id;

    connection.query('DELETE FROM doctors WHERE id=?', [doctorsId], (error, results) => {
        if (error) {
            console.error("Error deleting");

        }
        res.send(results);
    });
});

app.get('/displaydoc', (req, res) => {

    connection.query('SELECT * FROM doctors', (error, results) => {
        if (error) {
            console.error("Error fetching");
        }
        res.send(results);
    });
});
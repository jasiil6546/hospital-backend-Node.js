var express = require('express')
var router = express.Router();
app.post('/insert', async(req, res) => {
    // Get data from the request body
    const { Id, User_Name, Name, Age, phone, Email, Gender, Category, Duty_time } = req.body;

    try {
        // Get a database connection
        const connection = await pool.getConnection();

        // Find the right table based on the Category
        let tableToJoin = '';
        if (Category === 'Doctor') {
            tableToJoin = 'doctors';
        } else if (Category === 'Nurse') {
            tableToJoin = 'nurses';
        } else if (Category === 'Staff') {
            tableToJoin = 'staffs';
        } else {
            return res.status(400).json({ message: 'Invalid category' });
        }

        // Insert data into the registrations table, joining with the correct table
        const [result] = await connection.execute(`
        INSERT INTO registrations (Id, User_Name, Name, Age, phone, Email, Gender, Category, Duty_time, ${tableToJoin}_Id)
        SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, Id
        FROM ${tableToJoin}
        WHERE ${tableToJoin}.Id = ?`, [Id, User_Name, Name, Age, phone, Email, Gender, Category, Duty_time, Id]);

        // Close the database connection
        connection.release();

        // Send a success message
        res.json({ message: 'Record inserted successfully', results: result });
    } catch (error) {
        // Handle errors
        console.error('Error inserting record:', error);
        res.status(500).json({ message: 'Database error' });
    }
});
module.exports = router;
/////
const app = express();
const mysql = require('mysql');

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
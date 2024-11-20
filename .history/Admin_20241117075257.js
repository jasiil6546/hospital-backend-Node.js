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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Admin route to insert a record
app.post('/admin/insert', async(req, res) => {
    const { Id, User_Name, Name, Age, phone, Email, Gender, Category, Duty_time } = req.body;



    try {
        const connection = await pool.getConnection();

        // Determine the table based on the Category
        let tableName;
        switch (Category) {
            case 'Doctor':
                tableName = 'doctors';
                break;
            case 'Nurse':
                tableName = 'nurses';
                break;
            case 'Patient':
                tableName = 'patients';
                break;
            case 'Staff':
                tableName = 'staffs';
                break;
            case 'Registration':
                tableName = 'registrations';
                break;
            default:
                return res.status(400).json({ message: 'Invalid category' });
        }

        const [result] = await connection.execute(
            `INSERT INTO ?? (Id, User_Name, Name, Age, phone, Email, Gender, Category, Duty_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [tableName, Id, User_Name, Name, Age, phone, Email, Gender, Category, Duty_time]
        );

        connection.release();

        res.json({ message: 'Record inserted successfully', results: result });
    } catch (error) {
        console.error('Error inserting record:', error);
        res.status(500).json({ message: 'Database error' });
    }
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
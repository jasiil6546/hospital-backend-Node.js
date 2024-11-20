const express = require('express')
const router = express.Router();
module.exports = router;
const app = express();
const mysql = require('mysql');
//////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////ZZZZZZZZ
router.post('/insert', async(req, res) => {

    const { Id, User_Name, Name, Age, phone, Email, Gender, Category, Duty_time } = req.body;

    try {

        const connection = await pool.getConnection();


        let table = '';
        if (Category === 'Doctor') {
            table = 'doctors';
        } else if (Category === 'Nurse') {
            table = 'nurses';
        } else if (Category === 'Staff') {
            table = 'staffs';
        } else {
            return res.status(400).json({ message: 'Invalid category' });
        }

        connection.query(`INSERT INTO ${table} (Id, User_Name, Name, Age, phone, Email, Gender, Duty_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
        const [result] = await connection.query(query, [Id, User_Name, Name, Age, phone, Email, Gender, Duty_time]);

        connection.release();
        res.json({ message: 'Inserted successfully', result });
    } catch (error) {
        console.error('Error inserting:', error);
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

router.get('/displaydoc', (req, res) => {

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

router.delete('/delete/nr', (req, res) => {
    const Id = req.params.id;

    connection.query('DELETE FROM nurse WHERE id=?', [Id], (error, results) => {
        if (error) {
            console.error("Error deleting nurses");

        }
        res.send(results);
    });
});
router.get('/displaynr', (req, res) => {

    connection.query('SELECT * FROM nurse', (error, results) => {
        if (error) {
            console.error("Error fetching");
        }
        res.send(results);
    });
});
//////////////////////////////////////////////////////////////////////////////////////////

router.put('/update/stf', (req, res) => {
    const Id = req.params.id;
    const { Name } = req.body;
    console.log(Name);


    connection.query('UPDATE staffs SET doctorsId=? WHERE Name=?', [Name, Id], (error, results) => {
        if (error) {
            console.error("Error posting staffs");

        }
        res.send(results);
    });
});

router.delete('/delete/stf', (req, res) => {
    const Id = req.params.id;

    connection.query('DELETE FROM staffs WHERE id=?', [Id], (error, results) => {
        if (error) {
            console.error("Error deleting staffs");

        }
        res.send(results);
    });
});

router.get('/displaystaffs', (req, res) => {

    connection.query('SELECT * FROM staffs', (error, results) => {
        if (error) {
            console.error("Error fetching");
        }
        res.send(results);
    });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
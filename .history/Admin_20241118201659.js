const express = require('express')
const router = express.Router();
module.exports = router;
const fs = require('fs');
const puppeteer = require('puppeteer');
const path = require('path');
const mysql = require('mysql');
//////////////////////////////////////////////////////////////////////////////////////////////////
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospitalnodebackend'
})
connection.connect((error) => {
    if (error) {
        console.error("error database connecting");
        return;
    }
    console.log('connected to MySQL database');
})
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////ZZZZZZZZ
router.post('/insert', (req, res) => {
    const { User_Name, Name, Age, phone, Email, Gender, Category, Duty_time } = req.body;
    try {
        // const connection = await pool.getConnection();
        let table = '';
        if (Category === 'Doctor') {
            table = 'doctors';
        } else if (Category === 'Nurse') {
            table = 'nurse';
        } else if (Category === 'Staff') {
            table = 'staffs';
        } else {
            return res.status(400).json({ message: 'Invalid category' });
        }
        console.log(table);

        connection.query(`INSERT INTO ${table} (User_Name, Name, Age, phone, Email, Gender, Category, Duty_time) VALUES( ? , ? , ? , ? , ? , ? , ?, ? )`, [User_Name, Name, Age, phone, Email, Gender, Category, Duty_time], (error, result) => {
            if (error) {
                console.error('Error posting data:', error);
                return res.status(500).json({ message: 'Error saving user data' });
            }
            console.log(result);
            res.json({ message: 'User registered successfully' });
        });

    } catch {}
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



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////app.get('/peric/:id', async (req, res) => {




router.get('/peric/:id', async(req, res) => {
    const { Id } = req.params;

    connection.query('SELECT * FROM patients WHERE Id=?', [Id], async(err, results) => {
        if (err) {
            console.error('Error with MySQL:', err);
            return res.status(500).send('Database error');
        }
        if (results.length === 0) {
            console.warn('No booking found', results);
            return res.status(404).send('No booking found');
        }

        const name = results[0].Name;
        const Age = results[0].Age;
        const place = results[0].Addrs;
        const doctors = results[0].doctors;
        const gender = results[0].Gender;

        const generatePrescription = async() => {
            try {
                // Load HTML template
                const html = fs.readFileSync('hos.html', 'utf8');

                // Replace placeholders with actual data
                const date = new Date().toLocaleDateString();
                const filledHtml = html
                    .replace('{{patientName}}', name)
                    .replace('{{Age}}', Age)
                    .replace('{{date}}', date)
                    .replace('{{place}}', place)
                    .replace('{{doctor}}', doctors)
                    .replace('{{gender}}', gender);

                // Generate PDF
                const browser = await puppeteer.launch();
                const page = await browser.newPage();

                await page.setContent(filledHtml);
                const pdfPath = path.join(__dirname, `prescription - ${ Id }.pdf`);
                await page.pdf({ path: pdfPath, format: 'A4' });


                await browser.close();
                console.log('Prescription PDF generated:', pdfPath);

                // Send the PDF for download
                // res.download(pdfPath, prescription-${id}.pdf, (err) => {
                //     if (err) {
                //         console.error('Error sending the file:', err);
                //         res.status(500).send('Error generating the prescription.');
                //     }

                //     // Optional: Delete the file after download
                //     fs.unlink(pdfPath, (unlinkErr) => {
                //         if (unlinkErr) {
                //             console.error('Error deleting the file:', unlinkErr);
                //         }npmn
                //     });
                // });
                const pdfUrl = ` /prescriptions/prescription - ${ id }.pdf`;
                res.json({
                    message: 'Prescription generated successfully',
                    downloadUrl: pdfUrl,
                    printUrl: pdfUrl
                });
            } catch (error) {
                console.error('Error generating prescription:', error);
                res.status(500).send('Error generating the prescription.');
            }
        };

        await generatePrescription();
    });
});
router.use('/prescriptions', express.static(path.join(__dirname)));
module.exports = router;
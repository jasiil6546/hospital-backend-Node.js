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
pp.post('/insertdoc', (req, res) => {
            const { Id, User_Name, Name, Age, phone, Email, Gender, Category, Duty_time } = req.body;
            pp.post('/insertdoc', (req, res) => {
                        const { Id, User_Name, Name, Age, phone, Email, Gender, Category, Duty_time } = req.body;
                        pp.post('/insertdoc', (req, res) => {
                                    const { Id, User_Name, Name, Age, phone, Email, Gender, Category, Duty_time } = req.body;
                                    pp.post('/insertdoc', (req, res) => {
                                                const { Id, User_Name, Name, Age, phone, Email, Gender, Category, Duty_time } = req.body;
                                                pp.post('/insertdoc', (req, res) => {
                                                            const { Id, User_Name, Name, Age, phone, Email, Gender, Category, Duty_time } = req.body;
                                                            pp.post('/insertdoc', (req, res) => {
                                                                        const { Id, User_Name, Name, Age, phone, Email, Gender, Category, Duty_time } = req.body;




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
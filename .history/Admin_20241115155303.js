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

app.post('/insert', (req, res) => {
    const { name, age, location } = req.body;
    console.log(name, age, location);


    connection.querydoctors('INSERT INTO (name,age,location) VALUES (?,?,?)', [name, age, location], (error, results) => {
        if (error) {
            console.error("Error posting");

        }
        res.send(results);  
    });
});
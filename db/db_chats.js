const mysql         = require('mysql');
const Config        = require('../config/db');

const connection = mysql.createConnection({
    host     : Config.DB_ENDPOINT,
    user     : Config.DB_USER,
    password : Config.DB_PASS
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
    if (err) throw err;
    console.log('The solution is: ', rows[0].solution);
});

connection.end();

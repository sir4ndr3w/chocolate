const express = require('express');
const mysql = require('mysql');
const config = require('./config/db');
const app = express();
const router = express.Router();

/**
 * Error finden, warum Import nicht korrekt funktioniert
 */
//const profiles = require('./routes/profiles');
//const start = require('./routes/index');

/**
 * Database Dummy
 */
//const db_helper = require('./db/db_helper');
//const db_chats = require('./db/db_chats');
//const db_profiles = require('./db/db_profiles');

/**
 * Loggin Connections
 *
 * middleware function with no mount path, that loggs time
 * middleware sub-stack that returns URL and Request Type
 */
router.use(function (req, res, next) {
    console.log('Time:', Date.now());
    next();
});
// a middleware sub-stack shows request info for any type of HTTP request to the /user/:id path
router.use('/profiles/:id', function(req, res, next) {
    console.log('Request URL:', req.originalUrl);
    next();
}, function (req, res, next) {
    console.log('Request Type:', req.method);
    next();
});

/**
 * Connect to db
 * @type {Connection}
 */
const db        = mysql.createConnection({
    host            : config.DB_ENDPOINT,
    user            : config.DB_USER,
    password        : config.DB_PASS,
    database        : config.DB_NAME,
});

db.connect((err) => {
    if(err) throw(err);
    console.log("connected");
});

/**
 * Routing
 */
router.get('/profiles/:id', function (req, res, next) {
    res.header("Content-Type",'application/json');
        let sql = 'SELECT name, useralter, beschreibung, datum_registrierung, datum_lastseen, bilder from user_profiles WHERE id = ' + db.escape(req.params.id);
        let query = db.query(sql, (err, result) => {
            if (err) throw (err);
            if (result.length === 1) {
                res.send(JSON.stringify(result[0],0,5));
            } else {
                next('route');
            }
        });
});

/**
 * if User is not found
 */
router.get('/profiles/:id', function (req, res, next) {
    res.status(404);
    res.send({error: 'Benutzer existiert nicht.'});
});

/**
 * API Informationen
 */
router.get('/', function(req, res, next) {
    res.header("Content-Type",'application/json');
    let ApiPackage = require('./package.json');
    res.send(JSON.stringify(ApiPackage, 0, 5));
});

/**
 * mount the router on the app root path
  */
app.use('/', router);

/**
 * Falls keine Route gefunden wurde
 */
app.use(function(req, res, next){
    res.status(404);
    res.send({ error: 'Not found' });
});

/**
 * Server
 */
let port = process.env.port || 9000;
app.listen(port, function () {
    console.log('Server gestartet auf Port: ' + port);
});
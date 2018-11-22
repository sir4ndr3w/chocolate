const express = require('express');
const mysql = require('mysql');
const config = require('./config/db');
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();
const urlencodeParser = bodyParser.urlencoded({extended: false});
/**
 * Error finden, warum Import nicht korrekt funktioniert
 */
//const profiles = require('./routes/profiles');
//const start = require('./routes/index');

/**
 * Database Dummy
 */
//const db_chats = require('./db/db_chats');
//const db_profiles = require('./db/db_profiles');

/**
 * Logging Connections
 *
 */
router.use(function (req, res, next) {
    console.log('Time:', Date.now());
    next();
});
// a middleware sub-stack shows request info for any type of HTTP request to the /user/:id path
router.use('/profiles/:id', function (req, res, next) {
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
//TODO alle mysql funktionen ausgliedern
const db = mysql.createConnection({
    host: config.DB_ENDPOINT,
    user: config.DB_USER,
    password: config.DB_PASS,
    database: config.DB_NAME,
});

db.connect((err) => {
    if (err) throw(err);
    console.log("connected");
});

/**
 * Include middlewares
 */
//TODO ejs template für 404 erstellen
app.set('view engine', 'ejs');
app.use(bodyParser());

/**
 * Routing
 */
router.get('/profiles/get/:id', function (req, res, next) {
    res.header("Content-Type", 'application/json');
    if (Number.isInteger(parseInt(req.params.id))) {
        let sql = 'SELECT name, useralter, beschreibung, datum_registrierung, datum_lastseen, bilder from user_profiles WHERE id = ' + db.escape(req.params.id);
        db.query(sql, (err, result) => {
            if (err) throw (err);
            if (result.length === 1) {
                res.send(JSON.stringify(result[0], 0, 5));
            } else {
                next('route');
            }
        });
    } else {
        next('route');
    }
});

//TODO RegEx ausgliedern
router.post('/profiles/post/', urlencodeParser, function (req, res, next) {
    /**
     * RegEx für neue User
     * @type {RegExp}
     */
    const emailEx = /^([a-zA-Z0-9._-]{2,}@[a-zA-Z0-9._-]{2,}\.[a-zA-Z]{2,})$/;
    const isEmail = emailEx.test(req.body.email);

    const nameEx = /^([a-zA-Z-äöüÄÖÜß]{2,} [a-zA-Z- äöüÄÖÜß]{2,})$/;
    const isName = nameEx.test(req.body.name);

    const isAge = Number.isInteger(parseInt(req.body.useralter));

    const passwortEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
    const isPassword = passwortEx.test(req.body.passwort);

    const beschreibungEx = /[a-zA-Z &.!?:;,-/]/;
    const isBeschreibung = beschreibungEx.test(req.body.beschreibung);

    console.log(req.body);
    console.log(isEmail, isName, isPassword, isBeschreibung, isAge);

    if (isEmail && isName && isAge && isPassword && isBeschreibung) {
        let sql2 = "SELECT id FROM `chocolate`.`user_profiles` WHERE email = '" + req.body.email + "'";
        console.log(sql2);
        db.query(sql2, (err, result) => {
            if (err) throw (err);
            console.log(result.length);

            if (result.length == 0) {
                let sql = "INSERT INTO `chocolate`.`user_profiles`  (`id`, `name`, `passwort`, `email`, `useralter`, `beschreibung`, `lat`, `lon`, `datum_registrierung`, `datum_lastseen`, `bilder`) " +
                    "VALUES ('', '" + req.body.name + "', '" + req.body.passwort + "', '" + req.body.email + "', '" + req.body.useralter + "', '" + req.body.beschreibung + "', '1', '1', '1', '1', '[]');";
                db.query(sql, (err, result) => {
                    if (err) throw (err);
                    let sql = "SELECT LAST_INSERT_ID();";
                    db.query(sql, (err, result) => {
                        if (err) throw (err);
                        console.log(result[0]);
                        res.redirect('../get/' + result[0]["LAST_INSERT_ID()"]);
                    });
                });
                //TODO Weiterleitung mit Parametern je nach Fehler
            } else {
                next('route');
            }
        });
    } else {
        //ALternativ Redirect mit Infos etc
        next('route');
    }
});

/**
 * kein Benutzer gefunden
 */
router.get('/profiles/get/:id', function (req, res, next) {
    res.header("Content-Type", 'application/json');
    res.status(404);
    res.send(JSON.stringify({error: 'Benutzer existiert nicht.'}, 0, 5));
});

/**
 * falscher Input
 */
router.post('/profiles/post/', function (req, res, next) {
    res.header("Content-Type", 'application/json');
    res.status(404);
    res.send(JSON.stringify({
        error: 'Benutzer konnte nicht angelegt werden.',
        requirements: ">8 character, 1 Upper Case, 1 Lower Case, 1 Digit, 1 Sign",
        warning: "Your e-mail address may be in use already."
    }, 0, 5));
});

/**
 * Interface zum POST testen
 */
router.get('/profiles/post/', function (req, res) {
    res.sendFile(__dirname + "/tester.html");
});

/**
 * API Informationen
 */
router.get('/', function (req, res, next) {
    res.header("Content-Type", 'application/json');
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
app.use(function (req, res, next) {
    res.header("Content-Type", 'application/json');
    res.status(404);
    res.send(JSON.stringify({error: 'Not found'}, 0, 5));
});

/**
 * Server
 */
let port = process.env.port || 9000;
app.listen(port, function () {
    console.log('Server gestartet auf Port: ' + port);
});
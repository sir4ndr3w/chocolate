const express = require('express');
const pool = require('./db/connection');
const db_profiles = require('./db/db_profiles');
const bodyParser = require('body-parser');
const validator = require('./functions/validation');

const app = express();
const router = express.Router();
const urlencodeParser = bodyParser.urlencoded({extended: false});
/**
 * Error finden, warum Import nicht korrekt funktioniert
 */
//const profiles = require('./routes/profiles');
//const start = require('./routes/index');

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

pool.on('connection', function (connection) {
    console.log('Neue Verbindung aufgebaut.');
});

pool.on('release', function (connection) {
    console.log('Verbindung beendet');
});

/**
 * Include middlewares
 */
app.set('view engine', 'ejs');
app.use(bodyParser());

/**
 * Routing
 */
router.get('/profiles/get/:id', function (req, res, next) {
    res.header("Content-Type", 'application/json');
    let foundData = false;
    if (Number.isInteger(parseInt(req.params.id))) {
        db_profiles.getUserById(req.params.id, (err, data) => {
            if (err) throw err;

            if(data){
                foundData = true;
                res.send(JSON.stringify(data, null, 5));
            }
        });
    }
    if(!foundData){
        next('route');
    }
});

router.post('/profiles/post/', urlencodeParser, function (req, res, next) {
    let escapedInput = null;
    let userAdded = false;
    validator.registerUser(req.body, (err, data) => {
        if(err === null) {
            escapedInput = data;

            if (escapedInput[0]) {
                db_profiles.isEmailInUse(escapedInput[1], (err, emailIsInUse) => {
                    if (err) throw err;

                    if (!emailIsInUse) {
                        db_profiles.insertNewUser(escapedInput, (err, isInserted) => {
                            if (err) throw err;
                            if (isInserted) {
                                userAdded = true;
                                db_profiles.getNewUserId((err, result) => {
                                    res.redirect('../get/' + result);
                                });
                            }
                        });
                    }
                });
            }
        }
    });
    if(!userAdded){
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
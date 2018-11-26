const express = require('express');
const pool = require('./db/connection');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();

/**
 * Routing
 */
const profiles = require('./routes/profiles');
const chats = require('./routes/chats');

router.use(function (req, res, next) {
    console.log('Time:', Date.now());
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
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

router.use('/profiles/', profiles);
router.use('/chats/', chats);

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
const express = require('express');
const db_profiles = require('../db/db_profiles');
const bodyParser = require('body-parser');
const validator = require('../functions/validation');
const router = express.Router();
const urlencodeParser = bodyParser.urlencoded({extended: false});

/**
 * Benutzer ausgeben
 */
// a middleware sub-stack shows request info for any type of HTTP request to the /user/:id path
router.use(function (req, res, next) {
    console.log('Request URL:', req.originalUrl);
    next();
}, function (req, res, next) {
    console.log('Request Type:', req.method);
    next();
});

/**
 * Benutzerdaten laden
 */
router.get('/get/:id', function (req, res, next) {
    res.header("Content-Type", 'application/json');
    if (Number.isInteger(parseInt(req.params.id))) {
        db_profiles.getUserById(req.params.id, (err, data) => {
            if (err) throw err;

            console.log(data);

            if(data){
                res.send(JSON.stringify(data, null, 5));
            } else {
                next('route');
            }
        });
    } else {
        next('route');
    }
});

/**
 * kein Benutzer gefunden
 */
router.get('/get/:id', function (req, res, next) {
    res.header("Content-Type", 'application/json');
    res.status(404);
    res.send(JSON.stringify({error: 'Benutzer existiert nicht.'}, 0, 5));
});

/**
 * Interface zum POST testen
 */
router.get('/post/', function (req, res) {
    res.sendFile(__dirname + "/tester.html");
});

/**
 * Neuen Benutzer hinzufügen
 */
router.post('/post/', urlencodeParser, function (req, res, next) {
    res.header("Content-Type", 'application/json');
    let escapedInput = null;
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
                                db_profiles.getNewUserId((err, result) => {
                                    res.redirect('../get/' + result);
                                });
                            } else {
                                next('route');
                            }
                        });
                    } else {
                        next('route');
                    }
                });
            }
        } else {
            next('route');
        }
    });
});

/**
 * falscher Input
 */
router.post('/post/', function (req, res, next) {
    res.header("Content-Type", 'application/json');
    res.status(404);
    res.send(JSON.stringify({
        error: 'Benutzer konnte nicht angelegt werden.',
        requirements: ">8 character, 1 Upper Case, 1 Lower Case, 1 Digit, 1 Sign",
        warning: "Your e-mail address may be in use already."
    }, 0, 5));
});

module.exports = router;
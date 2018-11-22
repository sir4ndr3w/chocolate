const express = require('express');
const app = express();
const router = express.Router();

/**
 * Error finden, warum Import nicht korrekt funktioniert
 */
const profiles = require('./routes/profiles');
const start = require('./routes/index');

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
 * Returning Profile Data
 *
 * middleware sub-stack that returns error for special params
 */
router.get('/profiles/:id', function (req, res, next) {
    if(req.params.id == 0) next('route');
    else next();
}, function(req, res, next){
    res.send("normal");
});
router.get('/profiles/:id', function (req, res, next) {
    res.send("special");
});

router.get('/', function(req, res, next) {
    res.send('index');
});

// mount the router on the app
app.use('/', router);

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
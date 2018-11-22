/*

const mysql = require('mysql');
const config = require('../config/db');

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

exports.getUserData = function(userId) {
    let sql = 'SELECT * from user_profiles WHERE id = ' + userId;
    let query = db.query(sql, (err, result) => {
        if (err) throw (err);
        if (result.length === 1) {
            console.log("ja", result[0]);
            return result[0];
        }
        return false;
    });
};


const pool        = mysql.createPool({
    host            : 'localhost',
    user            : 'root',
    password        : 'kensxxx',
    database        : 'fbtool'
});

exports.getUserData = pool.getConnection(function (err, connection) {
        connection.query("SELECT * FROM user_profiles", function (err, rows) {
            connection.release();
            if (err) throw err;

            console.log(rows);
        });
});

exports.createUser = function(id,name,passwort,email,useralter,beschreibung,lat,lon,datum_lastseen,bilder,done){
    const values = [id,name,passwort,email,useralter,beschreibung,lat,lon,new Date().toISOString(),datum_lastseen,bilder];

    db.get().query("INSERT INTO user_profiles (id,name,passwort,email,useralter,beschreibung,lat,lon,datum_registrierung,datum_lastseen,bilder) VALUES (?,?,?,?,?,?,?,?,?,?,?)", values, function(err, result){
        if (err) return done(err);
        done(null, result.id);
    })
};

exports.getUserById = function(userId) {
        if(err) throw(err);
        let sql = 'SELECT * FROM user_profiles WHERE id = ' + userId;
        db.query(sql, (err, rows) => {
            if (err) throw(err);
            console.log(rows);
        });
};

*/
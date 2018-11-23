const pool = require('./connection');

module.exports = {
    getUserById: function (userID, callback) {
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query('SELECT name, useralter, beschreibung, datum_registrierung, datum_lastseen, bilder from user_profiles WHERE id = ' + connection.escape(userID), (err, result) => {
                let userData = false;
                if (result.length === 1) {
                    userData = result[0];
                }

                connection.release();
                if (err) callback(err, null);

                callback(null, userData);
            });
        });
    },
    isEmailInUse: function (email, callback) {
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query("SELECT id FROM `chocolate`.`user_profiles` WHERE email = " + email.toLowerCase(), (err, result) => {
                let isUsed = true;
                if (result.length === 0) {
                    isUsed = false;
                }
                connection.release();
                if(err) callback(err, null);

                callback(null, isUsed);
            });
        });
    },
    insertNewUser: function(userData, callback) {
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query("INSERT INTO `chocolate`.`user_profiles`  (`id`, `name`, `passwort`, `email`, `useralter`, `beschreibung`, `lat`, `lon`, `datum_registrierung`, `datum_lastseen`, `bilder`) " +
                "VALUES ('', " + userData[2] + ", " + userData[4] + ", " + userData[1] + ", " + userData[3] + ", " + userData[5] + " , '1', '1', '1', '1', '[]')", (err, result) => {

                console.log(result);

                connection.release();
                if (err) callback(err, false);

                callback(null, true);
            });
        });
    },
    getNewUserId: function(callback) {
        pool.getConnection((err, connection) => {
            if(err) throw err;
            connection.query("SELECT LAST_INSERT_ID();", (err, result) => {
                connection.release();
                if (err) callback (err, null);
                callback(null, result[0]["LAST_INSERT_ID()"]);
            });
        });
    }
};

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
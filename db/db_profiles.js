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
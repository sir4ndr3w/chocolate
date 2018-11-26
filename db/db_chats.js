const pool = require('./connection');

module.exports = {
    getUserById: function (userID, callback) {
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query('SELECT name, useralter, beschreibung, datum_registrierung, datum_lastseen, bilder from user_profiles WHERE id = ' + connection.escape(userID), (err, result) => {
                let userData = null;
                if (result.length === 1) {
                    userData = result[0];
                }

                connection.release();
                if (err) callback(err, null);

                callback(null, userData);
            });
        });
    }
};
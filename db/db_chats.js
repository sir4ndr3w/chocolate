/*

const db = require('./db_helper');

exports.createUser = function(id,name,passwort,email,useralter,beschreibung,lat,lon,datum_lastseen,bilder,done){
    const values = [id,name,passwort,email,useralter,beschreibung,lat,lon,new Date().toISOString(),datum_lastseen,bilder];

    db.get().query("INSERT INTO user_profiles (id,name,passwort,email,useralter,beschreibung,lat,lon,datum_registrierung,datum_lastseen,bilder) VALUES (?,?,?,?,?,?,?,?,?,?,?)", values, function(err, result){
        if (err) return done(err);
        done(null, result.id);
    })
};

exports.getUserById = function(userId, done) {
    db.connect(function() {
        db.getUserData('SELECT * FROM user_profiles WHERE id = ?', userId, function (err, rows) {
            if (err) return done(err);
            done(null, rows);
        });
    });
};

*/
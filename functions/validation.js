const mysql = require('mysql');

module.exports = {
    registerUser: function (userData, callback) {

        console.log(userData);
        if (userData.email === "" || userData.name === "" || userData.passwort === "" || userData.beschreibung === "" || userData.useralter === "") {
            callback("Leeres Feld", null);
        } else {

            const emailEx = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            const isEmail = emailEx.test(userData.email);

            const nameEx = /^([a-zA-Z-äöüÄÖÜß]{2,} [a-zA-Z- äöüÄÖÜß]{2,})$/;
            const isName = nameEx.test(userData.name);

            const isAge = Number.isInteger(parseInt(userData.useralter));

            const passwortEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
            const isPassword = passwortEx.test(userData.passwort);

            const beschreibungEx = /[a-zA-Z &.!?:;,-/]/;
            const isBeschreibung = beschreibungEx.test(userData.beschreibung);

            const isInputValid = (isEmail && isName && isAge && isPassword && isBeschreibung);

            callback(null, [isInputValid, mysql.escape(userData.email.toLowerCase()), mysql.escape(userData.name), mysql.escape(userData.alter), mysql.escape(userData.passwort), mysql.escape(userData.beschreibung)]);
        }
    }
};
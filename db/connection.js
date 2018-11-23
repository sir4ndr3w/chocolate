const mysql = require('mysql');
const config = require('../config/db');

const pool  = mysql.createPool({
    connectionLimit : config.DB_CONNECTION_LIMIT,
    host            : config.DB_HOST,
    user            : config.DB_USER,
    password        : config.DB_PASSWORD,
    database        : config.DB_DATABASE,
});

module.exports = pool;


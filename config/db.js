const mysql = require('mysql2/promise');
require('dotenv').config();

// DATABASE_URL is provided by Railway.
const pool = mysql.createPool(process.env.DB_URL);

module.exports = pool;
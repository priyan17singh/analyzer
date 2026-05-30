// const mysql = require('mysql2/promise');
// require('dotenv').config();

// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     waitForConnections: true,
//     connectionLimit: 5
// });

// module.exports = pool;

// config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

// DATABASE_URL is provided automatically by Railway.
// Example format: mysql://avnadmin:password@my-mysql.aivencloud.com:12345/defaultdb
const pool = mysql.createPool(process.env.DB_URL);

module.exports = pool;
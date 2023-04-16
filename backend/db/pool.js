const mysql = require('mysql2');
require('dotenv').config();


const pool = mysql.createPool({
  timezone: 'UTC',
  dateStrings: [
    'DATE',
    'DATETIME',
  ],
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database:  process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
});

module.exports = pool;
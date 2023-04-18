const mysql = require('mysql2');
require('dotenv').config();


const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database:  process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
  timezone: 'Z',
});

module.exports = pool;
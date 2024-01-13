require("dotenv").config();
const mysql = require("mysql2/promise");
const contprom = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DB,
  port: process.env.MYSQL_PORT,
});

module.exports = contprom;

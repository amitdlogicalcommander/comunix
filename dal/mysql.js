
const mysql = require('mysql');

let connection = mysql.createConnection({
  host     : process.env.DATABASE_HOST,
  user     : process.env.DATABASE_USER,
  password : process.env.DATABASE_PASS,
  database : process.env.DATABASE_NAME
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Mysql Connected!");
});

module.exports = connection;

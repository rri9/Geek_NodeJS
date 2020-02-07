const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'db4free.net',
  port: '3306',
  user: 'root_rri9',
  password: '12345678',
  database: 'mysql_rri9',
});

connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Успешное подключение к БД');
  }
});

module.exports = connection;

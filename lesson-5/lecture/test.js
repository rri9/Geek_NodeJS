//TODO Протестировать соединение с БД MongoDB
//TODO Сохранение изменений в БД в Docker'е

const mysql = require('mysql');

const connection = mysql.createConnection({
  host: '192.168.99.100',
  port: '3307',
  database: 'mysql',
  user:     'root',
  password: 'pwd',
});

connection.connect(err => {
  if (err) {
    return console.log(`Ошибка: ${err}`);
  }
  return console.log('Успешное подключение к БД');
});

const sql = [
  // 'CREATE DATABASE lessonDB;',
  'USE lessonDB;',
  'CREATE TABLE cars(id INT AUTO_INCREMENT PRIMARY KEY, mark NVARCHAR(30), model NVARCHAR(50), year YEAR, price INT UNSIGNED);',
  'INSERT cars (mark, model, year, price) VALUES ("KIA", "SORENTO", 2018, 2150000);',
  'INSERT cars (mark, model, year, price) VALUES ("KIA", "CEED", 2019, 1125000);',
  'INSERT cars (mark, model, year, price) VALUES ("KIA", "CERATO GTLine", 2020, 1400000);',
  // + 'SELECT * FROM cars;',
];

sql.forEach(cmd => {
  connection.query(cmd, (err, rows) => {
    if (err) {
      // closeConn();
      return console.log(`Ошибка: ${err}`);
    }
    // closeConn();
    return console.log(rows);
  });
});

closeConn();
function closeConn() {
  connection.end();
  console.log('Подключение закрыто');
}

// const pool = mysql.createPool({
//   connectionLimit: 5,
//   host:     'localhost',
//   database: 'testDB',
//   user:     'root',
//   password: 'pwd',
// });
// pool.end((err) => {
//   if (err) {
//     console.log(err.message);
//   }
// });

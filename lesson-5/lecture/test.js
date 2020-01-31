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
    return console.log('Ошибка: ' + err);
  }
  console.log('Успешное подключение к БД');
  connection.end();
  return console.log('Подключение закрыто');
});

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

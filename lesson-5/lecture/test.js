const mysql = require();

const connection = mysql.createConnection({
  host:     'localhost',
  database: 'testDB',
});

//TODO Протестировать соединение с БД MySQL
//TODO Протестировать соединение с БД MongoDB
//TODO Сохранение изменений в БД в Docker'е

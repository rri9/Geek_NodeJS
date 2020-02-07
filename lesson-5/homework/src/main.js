//TODO Pool
//TODO Пример CRUD https://habr.com/ru/company/ruvds/blog/321104/
//TODO Пример CRUD https://developer.mozilla.org/ru/docs/Learn/Server-side/Express_Nodejs/skeleton_website

const connParams = {
  host: '127.0.0.1',
  port: '3306',
  database: 'mysql',
  user: 'root',
  password: 'pwd',
};

const Conn = require('./connection');
const conn = new Conn(connParams);
const newData = ['BMW', '725', 2017, 2100000];

// conn.execCmd('USE homeworkDB;').catch(err => console.log(err.message));
conn.execCmd('USE homeworkDB;').catch(err => {
  if (err) {
    conn
      ._initDB()
      .finally(() => conn.closeConn())
      .catch(err => console.log('Инициализация БД не выполнена!'))
      .then(() => conn.execCmd('USE homeworkDB;'));
  }
});
// conn._initDB()
//   .then(() => this.closeConn())
//   .catch(err => {
//     throw err;
//   });

  // conn.execCmdData('INSERT INTO cars (mark, model, year, price) VALUES (?,?,?,?);', newData)
  // conn.execCmdData('INSERT INTO cars VALUES ("BMW","725",2017,2100000);')
  //   // .finally(() => conn.closeConn())
  //   .catch(err => console.log(err.message));

  // conn.execCmdData('SELECT * FROM cars WHERE id = ?;', ['2'])
  //   // .finally(() => conn.closeConn())
  //   .catch(err => console.log(err.message));

  conn.execCmd('SELECT * FROM cars;')
  .then(result => {debugger; return console.log(result); })
  .finally(() => conn.closeConn())
  // .catch(err => { throw err; });
  .catch(() => console.log('Запрос к БД не выполнен!'));

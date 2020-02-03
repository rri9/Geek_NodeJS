const Conn = require('./config');
const conn = new Conn();
const newData = ['BMW', '725', 2017, 2100000];

conn.createConn();
conn.execCmd('USE lessonDB;');
// conn.execCmdData('INSERT INTO cars VALUES(?,?,?,?);', newData);
conn.execCmd('SELECT * FROM `cars` WHERE `id` = ?', ['2'])
// conn.execCmd('SELECT * FROM cars;')
  .catch((err) => {
    throw err;
  })
  .then(() => conn.closeConn() );

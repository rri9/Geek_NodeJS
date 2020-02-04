//TODO Pool

const express = require('express'),
  app = express(),
  path = require('path'),
  hbs = require('hbs');

const Conn = require('./connection');
const conn = new Conn();
const newData = ['BMW', '725', 2017, 2100000];

// conn.execCmd('USE homeworkDB;').catch(err => console.log(err.message));
conn.execCmd('USE homeworkDB;').catch(err => {
  if (err) {
    conn._initDB()
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

conn
  .execCmdData('INSERT INTO cars (mark, model, year, price) VALUES (?,?,?,?);', newData)
  // conn.execCmdData('INSERT INTO cars VALUES ("BMW","725",2017,2100000);')
  //   // .finally(() => conn.closeConn())
  //   .catch(err => console.log(err.message));

  // conn.execCmdData('SELECT * FROM cars WHERE id = ?;', ['2'])
  //   // .finally(() => conn.closeConn())
  //   .catch(err => console.log(err.message));

  // conn.execCmd('SELECT * FROM cars;')
  .then(result => console.log(result))
  .finally(() => conn.closeConn())
  // .catch(err => { throw err; });
  .catch(() => console.log('Запрос к БД не выполнен!'));

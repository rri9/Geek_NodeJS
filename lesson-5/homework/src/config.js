const mysql = require('mysql');

class Connection {
  constructor(params) {
    this.defaultParams = {
      host: '192.168.99.100',
      port: '3307',
      database: 'mysql',
      user: 'root',
      password: 'pwd',
    };
    this.connection = this.createConn(params);
  }

  createConn(params) {
    if (params) {
      return mysql.createConnection(params);
    }
    return mysql.createConnection(this.defaultParams);
  }

  closeConn() {
    this.connection.end(err => {
      console.log('Подключение закрыто');
      return err;
    });
  }

  _connect() {
    this.connection.connect(err => {
      if (err) {
        console.log(`Ошибка: ${err}`);
        throw err;
      }
      return console.log('Успешное подключение к БД');
    });
  }

  execCmd(cmd) {
    return new Promise((resolve, reject) => {
      this.connection.query(cmd, (err, result, fields) => {
        if (err) {
          console.log(`Ошибка: ${err}`);
          reject(err);
        }
        console.log(result);
        resolve(result);
      });
    });
  }

  execCmdData(cmd, data) {
    return new Promise((resolve, reject) => {
      this.connection.query(cmd, data, (err, result, fields) => {
        if (err) {
          console.log(`Ошибка: ${err}`);
          reject(err);
        }
        console.log(result);
        resolve(result);
      });
    });
  }
}

module.exports = Connection;

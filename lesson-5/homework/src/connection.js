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
    this.initCmd = [
      'CREATE DATABASE homeworkDB;',
      'USE homeworkDB;',
      'CREATE TABLE cars (id INT AUTO_INCREMENT PRIMARY KEY, mark NVARCHAR(30), model NVARCHAR(50), year YEAR, price INT UNSIGNED);',
      'INSERT cars (mark, model, year, price) VALUES ("KIA", "SORENTO", 2018, 2150000);',
      'INSERT cars (mark, model, year, price) VALUES ("KIA", "CEED", 2014, 750000);',
      'INSERT cars (mark, model, year, price) VALUES ("KIA", "CERATO GTLine", 2020, 1450000);',
    ];
    this.connection = this.createConn(params);
  }

  createConn(params) {
    const conn = params ? mysql.createConnection(params) : mysql.createConnection(this.defaultParams);
    if (conn) {
      console.log('Успешное подключение к БД');
    }
    return conn;
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
        return console.log(`Ошибка: ${err}`);
      }
      return console.log('Успешное подключение к БД');
    });
  }

  execCmd(cmd) {
    return new Promise((resolve, reject) => {
      this.connection.query(cmd, (err, result, fields) => {
        if (err) {
          console.log(`  Ошибка в execCmd:\n${err.message}`);
          console.log(`  SQL:\n${cmd}`);
          // this.closeConn();
          reject(new Error('execCmd error'));
        }
        // console.log(result);
        // this.closeConn();
        resolve(result);
      });
    });
  }

  execCmdData(cmd, data) {
    return new Promise((resolve, reject) => {
      this.connection.query(cmd, data, (err, result, fields) => {
        if (err) {
          console.log(`  Ошибка в execCmdData:\n${err.message}`);
          console.log(`  SQL:\n${cmd}`);
          // this.closeConn();
          reject(new Error('ExecCmd error'));
        }
        // console.log(result);
        // this.closeConn();
        resolve(result);
      });
    });
  }

  _initDB() {
    return new Promise((resolve, reject) => {
      this.initCmd.forEach(cmd => {
        this.execCmd(cmd)
          .then(() => resolve())
          .catch((err) => reject(new Error(`_initDB error: ${err.message}`)));
      });
    });
  }
}

module.exports = Connection;

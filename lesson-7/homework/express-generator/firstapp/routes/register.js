//TODO REST API
const express = require('express');
const router = express.Router();
const db = require('../lib/db');
const crypt = require('../lib/crypt');

/* Registration form */
router.get('/', (req, res) => {
  console.log(req.query);
  res.render('register', {
    error: req.query.error,
    errmesage: req.query.errmessage,
  });
});

/* Registration method */
router.post('/', (req, res) => {
  //Check if username allready exist
  db.connection.query('SELECT * FROM users WHERE name = ?', req.body.username, (err, rows) => {
    if (err) {
      console.log(err);
      res.render('error', {
        'message': err.message,
        'error.status': err.status,
        'error.stack': err.stack,
      });
    } else if (rows.length > 0) {
      res.render('register', {
        error: true,
        errmessage: 'Пользователь с таким именем уже зарегистрирован',
      });
    } else {
      const newUser = {
        name: req.body.username,
        password: crypt.makePwdCrypted(req.body.password),
      };
      db.connection.query('INSERT users SET ?', newUser, (err) => {
        if (err) {
          console.log('error in post /register');
          res.render('error', {
            message: err.message,
            'error.status': err.status,
            'error.stack': err.stack,
          });
        } else {
          res.send('<h2>Вы успешно зарегистрировались!</h2>'
          + '<a href="/login">Авторизоваться</a>');
        }
      });
    }
  });
});

module.exports = router;

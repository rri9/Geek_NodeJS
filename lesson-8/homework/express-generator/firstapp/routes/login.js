const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../lib/db');
const crypt = require('../lib/crypt');
const secretPhrase = require('../lib/credentials');

router.get('/', express.static('public/main.html'));

/* Login method */
router.post('/', (req, res) => {
  const { username, password } = req.body;
  db.connection.query('SELECT * FROM users WHERE name = ?', username, (err, rows) => {
    if (err) {
      console.log('DB error: ', err);
      return res.json({ autherror: true, message: `DB error: ${err}` });
    }
    const user = rows[0];
    if (!user) {
      console.log('Incorrect username.');
      return res.status(403).json({ autherror: true, message: 'Неверное имя пользователя.' });
    }
    if (!crypt.isPwdGood(password, user.password)) {
      console.log('Incorrect password.');
      return res.status(403).json({ autherror: true, message: 'Неверный пароль.' });
    }
    const plainUser = { ...user };
    delete plainUser.password;
    // Реализация записи токена в куки на backend'е
    // const token = jwt.sign(plainUser, secretPhrase);
    // res.cookie(`token=${token}; HttpOnly; path='/'`);
    return res.json({
      autherror: false,
      message: 'Успешная авторизация',
      token: jwt.sign(plainUser, secretPhrase),
      // token: token,
    });
  });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../lib/db');
const secretPhrase = require('../lib/credentials');

//Проверка авторизации (токена)
router.use((req, res, next) => {
  if (!req.cookies.token) {
    return res.json({ autherror: true, message: 'No token' });
  }
  const { token } = req.cookies;
  // if (type === 'Bearer') {
  jwt.verify(token, secretPhrase, (err, payload) => {
    if (err) {
      return res.json({ autherror: true, message: 'Wrong token' });
    }
    req.user = payload;
    console.log('  In cars.js payload = ', payload);
    return next();
  });
  // }
});

/* GET cars */
router.get('/', (req, res) => {
  db.connection.query('SELECT * FROM cars ORDER BY id asc', (err, rows) => {
    if (err) {
      console.log(err);
      res.render('error', {
        message: err.message,
        'error.status': err.status,
        'error.stack': err.stack,
      });
    } else {
      // res.render('cars', { cars: rows });
      res.json({ cars: rows });
    }
  });
});
// /* ADD cars form  */
// router.get('/add', (req, res) => {
//   res.render('addCar', {});
// });
/* ADD cars method*/
router.post('/', (req, res) => {
  const car = {
    mark: req.body.mark,
    model: req.body.model,
    year: req.body.year,
    price: req.body.price,
  };
  console.log(car);
  db.connection.query('INSERT cars SET ?', car, (err, data) => {
    if (err) {
      console.log('error in post /');
      res.render('error', {
        message: err.message,
        'error.status': err.status,
        'error.stack': err.stack,
      });
    } else {
      res.json(data.insertId);
    }
  });
});
// /* EDIT car form */
// router.get('/edit', (req, res) => {
//   if (Object.prototype.hasOwnProperty.call(req.query, 'id')) {
//     db.connection.query('SELECT * FROM cars WHERE id = ?', req.query.id, (err, rows) => {
//       if (err) {
//         console.log(err);
//         res.render('error', {
//           message: err.message,
//           'error.status': err.status,
//           'error.stack': err.stack,
//         });
//       } else {
//         res.render('editCar', { car: rows[0] });
//       }
//     });
//   } else {
//     res.render('editCar');
//   }
// });

/* EDIT cars method*/
router.put('/:id', (req, res) => {
  const car = {
    mark: req.body.mark,
    model: req.body.model,
    year: req.body.year,
    price: req.body.price,
  };
  console.log(car);
  db.connection.query('UPDATE cars SET ? WHERE id = ?', [car, req.params.id], (err, data) => {
    if (err) {
      console.log('error in post /edit');
      res.render('error', {
        'message': err.message,
        'error.status': err.status,
        'error.stack': err.stack,
      });
    } else {
      res.json(data);
    }
  });
});
/* TODO Частичное изменение записи */
//router.patch('/:id', (req, res) => {

/* DELETE cars method*/
router.delete('/:id', (req, res) => {
  console.log('in del method');
  if (Object.prototype.hasOwnProperty.call(req.query, 'id')) {
    db.connection.query('DELETE FROM cars WHERE id = ?', req.params.id, (err, data) => {
      if (err) {
        console.log(err);
        res.render('error', {
          'message': err.message,
          'error.status': err.status,
          'error.stack': err.stack,
        });
      } else {
        console.log('delete row id = ', req.query.id);
        res.json(data);
      }
    });
  }
});

module.exports = router;

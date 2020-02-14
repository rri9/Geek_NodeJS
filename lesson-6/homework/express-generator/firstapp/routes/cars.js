const express = require('express');
const router = express.Router();
const db = require('../lib/db');

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
      res.render('cars', { cars: rows });
    }
  });
});
/* ADD cars form  */
router.get('/add', (req, res) => {
  res.render('addCar', {});
});
/* ADD cars method*/
router.post('/add', (req, res) => {
  const car = {
    mark: req.body.mark,
    model: req.body.model,
    year: req.body.year,
    price: req.body.price,
  };
  console.log(car);
  db.connection.query('INSERT cars SET ?', car, (err) => {
    if (err) {
      console.log('error in post /add');
      res.render('error', {
        message: err.message,
        'error.status': err.status,
        'error.stack': err.stack,
      });
    } else {
      res.redirect('/cars');
    }
  });
});
/* EDIT car form */
router.get('/edit', (req, res) => {
  if (Object.prototype.hasOwnProperty.call(req.query, 'id')) {
    db.connection.query('SELECT * FROM cars WHERE id = ?', req.query.id, (err, rows) => {
      if (err) {
        console.log(err);
        res.render('error', {
          message: err.message,
          'error.status': err.status,
          'error.stack': err.stack,
        });
      } else {
        res.render('editCar', { car: rows[0] });
      }
    });
  } else {
    res.render('editCar');
  }
});

/* EDIT cars method*/
router.post('/edit', (req, res) => {
  const car = {
    mark: req.body.mark,
    model: req.body.model,
    year: req.body.year,
    price: req.body.price,
  };
  console.log(car);
  db.connection.query('UPDATE cars SET ? WHERE id = ?', [car, req.body.id], (err) => {
    if (err) {
      console.log('error in post /edit');
      res.render('error', {
        'message': err.message,
        'error.status': err.status,
        'error.stack': err.stack,
      });
    } else {
      res.redirect('/cars');
    }
  });
});

/* DELETE cars method*/
router.get('/del', (req, res) => {
  console.log('in del method');
  if (Object.prototype.hasOwnProperty.call(req.query, 'id')) {
    db.connection.query('DELETE FROM cars WHERE id = ?', req.query.id, (err) => {
      if (err) {
        console.log(err);
        res.render('error', {
          message: err.message,
          'error.status': err.status,
          'error.stack': err.stack,
        });
      } else {
        console.log('delete row id = ', req.query.id);
        res.redirect('/cars');
      }
    });
  }
});

module.exports = router;

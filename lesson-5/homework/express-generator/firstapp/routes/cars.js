const express = require('express');
const router = express.Router();
const connection = require('../lib/db');

/* GET users listing. */
router.get('/', (req, res, next) => {
  connection.query('SELECT * FROM cars ORDER BY id asc', (err, rows) => {
    if (err) {
      console.log(err);
      res.render('error', {
        message: err.message,
        'error.status': err.status,
        'error.stack': err.stack,
      });
    } else {
      debugger
      res.render('cars', { cars: rows });
    }
  });
});

router.get('/add', (req, res, next) => {
  res.render('addCar', {});
});

router.post('/add', (req, res, next) => {
  const car = {
    mark: req.body.mark,
    model: req.body.model,
    year: req.body.year,
    price: req.body.price,
  };
  console.log(car);
  connection.query('INSERT cars SET ?', car, (err, result) => {
    if (err) {
      console.log('error in post /add');
      res.render('error', {
        message: err.message,
        'error.status': err.status,
        'error.stack': err.stack,
      });
    } else {
      console.log('redirection...');
      res.redirect('/cars');
    }
  });
});

module.exports = router;

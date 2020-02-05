const express = require('express');
const router = express.Router();
const connection = require('../lib/db');

/* GET users listing. */
router.get('/', (req, res, next) => {
  connection.query('SELECT * FROM cars ORDER BY id desc', (err, rows) => {
    if (err) {
      console.log(err);
      res.render('error', {
        message: err.message,
        'error.status': err.status,
        'error.stack': err.stack,
      });
    } else {
      res.render('cars', { data: rows });
    }
  });
});

router.get('/add', (req, res, next) => {
  res.render('addCar', {});
});

router.post('/add', (req, res, next) => {
  
});

module.exports = router;

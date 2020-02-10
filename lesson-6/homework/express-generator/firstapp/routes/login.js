const express = require('express');
const router = express.Router();
// const connection = require('../lib/db');
const passport = require('../lib/auth');

/* Login form */
router.get('/', (req, res) => {
  res.render('login', { error: req.query.error });
});

/* Login method */
router.post('/', passport.authenticate);

module.exports = router;

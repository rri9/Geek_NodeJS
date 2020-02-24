const express = require('express');
const router = express.Router();
// const connection = require('../lib/db');
const passport = require('../lib/auth');

/* Login form */
router.get('/', (req, res) => {
  res.render('login', {
    error: !!req.query.error,
    errmessage: req.flash('error')[0],
  });
});

/* Login method */
// router.post('/', passport.authenticate);
router.post('/', passport.authenticate, (req, res) => {
  if (req.body.remember) {
    req.session.cookie.maxAge = 1000 * 60 * 60 * 24; //1 день
  }
  res.redirect('/cars');
});

module.exports = router;

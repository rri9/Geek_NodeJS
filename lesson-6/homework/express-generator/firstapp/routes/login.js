const express = require('express');
const router = express.Router();
// const connection = require('../lib/db');
const passport = require('../lib/auth');

/* Login form */
router.get('/', (req, res) => {
  res.render('login', { error: req.query.error });
});

/* Login method */
// router.post('/', passport.authenticate);
router.post('/', passport.authenticate, (req, res) => {
  debugger
  console.log('  In /login authenticate req.user: ', req.user);
  console.log('  In /login authenticate req.passport: ', req.passport);
  console.log('  In /login authenticate req.session: ', req.session);
  res.redirect('/cars');
});

module.exports = router;

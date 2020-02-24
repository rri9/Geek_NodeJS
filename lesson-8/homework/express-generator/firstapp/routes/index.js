const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.redirect('/login'));
//TODO Почему не отправляет main (как в router/login.js)
// router.get('/', express.static('public/main.html'));
// router.get('/', (req, res) => res.sendFile('./public/main.html'));

router.use('/cars', require('./cars'));
router.use('/login', require('./login'));
router.use('/register', require('./register'));

module.exports = router;

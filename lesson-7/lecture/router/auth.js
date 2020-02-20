const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const User = require('../models/user');

// Автороизация по токену
router.post('/', async (req, res) => { // localhost/auth/
  const { username, password } = req.body;
  const user = await User.findOne({username});

  if (!user) {
    return res.json({ message: 'Wrong user' });
  }

  if (!user.comparePassword(password)) {
    return res.json({ message: 'Wrong password' });
  }

  const plainUser = JSON.parse(JSON.stringify(user));
  delete plainUser.password;

  res.json({
    token: jwt.sign(plainUser, 'secret-user-phrase'),
  });
});

module.exports = router;

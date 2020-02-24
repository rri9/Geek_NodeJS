const express = require('express');
const router = express.Router();
const auth = require('./auth');
const tasks = require('./tasks');

router.use('/auth', auth);
router.use('/tasks', tasks);

module.exports = router;

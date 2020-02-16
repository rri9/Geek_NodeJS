const express = require('express');
const router = express.Router();

/* Login method */
router.get('/', (req, res) => {
  req.logout();
  res.redirect('/cars');
});

module.exports = router;

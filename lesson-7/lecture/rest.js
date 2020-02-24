/*
GET - Read
POST - Create
PUT - Update (full)
PATCH - Update (partitial)
DELETE - Delete

CRUD
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const router = require('./router');

mongoose.connect('mongodb://localhost:32772/insta', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
app.use(cors());
app.use(express.json());
app.use('/tasks', async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.json({ message: 'No token' });
  } else {
    const [type, token] = req.headers.authorization.split(' ');

    jwt.verify(token, 'secret-user-phrase', (err, payload) => {
      if (err) {
        return res.json({ message: 'Wrong token' });
      }

      req.user = payload;

      next();
    });
  }
});
app.use(router);

app.listen(8888);
// domain.com
// api.domain.com
// CORS browser -> preflight (OPTIONS)
// Access-Control-Allow-Origin

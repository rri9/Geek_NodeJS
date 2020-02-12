const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

passport.use('login',
  new LocalStrategy(
    { session: false, passReqToCallback: true },
    (req, username, password, done) => {
      // passport.use(new LocalStrategy((username, password, done) => {
      console.log('  In passport.use(new LocalStrategy...)');
      console.log('req.body = ', req.body);
      console.log('req.user = ', req.user);
      const user = {
        username: username,
        password: password,
      };
      if (user.username === 'Petr' && user.password === '123') {
        console.log('Username and password OK');
        return done(null, user);
      }
      return done(null, false, { message: 'Wrong username or password!' });
    },
  ),
);

// app.post('/', passport.authenticate('login', {
//   session: false,
// },
// (req, res) => {
//   // app.post('/', passport.authenticate('local', (req, res) => {
//   console.log('  In passport.authenticate');
//   console.log('req.body = ', req.body);
//   console.log('req.user = ', req.user);
//   res.send('auth');
// }));
app.post('/', passport.authenticate('login', {
  session: false,
  successRedirect: '/success',
  failureRedirect: '/failure',
}));

app.use('/', (req, res, next) => {
  console.log('  In app.use /');
  console.log('req.body = ', req.body);
  console.log('req.user = ', req.user);
  next();
});

app.use('/', (req, res, next) => {
  console.log('Request at /');
  next();
});
app.use('/success', (req, res, next) => {
  res.send('success');
  next();
});
app.use('/failure', (req, res, next) => {
  res.send('failure');
  next();
});

app.listen(8000, () => {
  console.log('Server "Test" starts at port 8000');
});

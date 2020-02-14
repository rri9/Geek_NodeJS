const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const app = express();

const MySQLStoreOptions = {
  host: 'db4free.net',
  port: '3306',
  user: 'root_rri9',
  password: '12345678',
  database: 'mysql_rri9',
};
const sessionStore = new MySQLStore(MySQLStoreOptions);

const mustBeAuthenticated = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/');
  }
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: 'keyboard cat',
    store: sessionStore,
  })
); //до или после json и urlencoded ???
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  'login',
  new LocalStrategy(
    { passReqToCallback: true },
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
    }
  )
);
passport.serializeUser((user, done) => {
  console.log('  In serializeUser');
  console.log('user = ', user);
  // console.log('user.name = ', user.username);
  done(null, user.name);
});

passport.deserializeUser((name, done) => {
  console.log('  In deserializeUser');
  console.log('name = ', name);
  const mysql = require('mysql');
  const connection = mysql.createConnection({ MySQLStoreOptions });
  connection.query('SELECT * FROM users WHERE name = ?', name, (err, rows) => {
    // const user = rows[0];
    console.log('rows = ', rows);
    if (!err) {
      const user = {
        id: rows[0].id,
        name: rows[0].name,
        password: rows[0].password,
      };
    }
    done(err, user.name);
  });
});

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
app.post(
  '/',
  passport.authenticate('login', {
    // session: false,
    successRedirect: '/success',
    failureRedirect: '/failure',
  })
);
app.get('/', (req, res, next) => {
  console.log('Request GET at /');
  res.send('/');
});

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
  console.log('Request at /success');
  res.send('success');
  next();
});
app.use('/failure', (req, res, next) => {
  console.log('Request at /failure');
  res.send('failure');
  next();
});

app.use('/data', mustBeAuthenticated);
app.use('/data', (req, res) => {
  console.log('Request at /data');
  res.send('data');
});

app.listen(8000, () => {
  console.log('Server "Test" starts at port 8000');
});

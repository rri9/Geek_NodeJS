/*
  Ivan - 12345678
  Petr - 123
*/

const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const db = require('./db');

// passport.use(new Strategy({ session: false }, (username, password, done) => {
passport.use(new Strategy((username, password, done) => {
  db.connection.query('SELECT * FROM users WHERE name = ?', username, (err, rows) => {
    if (err) {
      console.log(err);
      return done(err);
    }
    const user = rows[0];
    if (!user) {
      console.log('Incorrect username.');
      return done(null, false, { message: 'Неверное имя пользователя.' });
    }
    if (password !== user.password) {
      console.log('Incorrect password.');
      return done(null, false, { message: 'Неверный пароль.' });
    }
    const plainUser = { ...user };
    delete plainUser.password;
    console.log('  In done plainUser = ', plainUser);
    return done(null, plainUser);
  });
}));

function isUserAuthenticate(req, res, next) {
  console.log('  In isUserAuthenticate req.user: ', req.user);
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

passport.serializeUser((user, done) => {
  console.log('  In serialize');
  return done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log('  In deserialize');
  db.connection.query('SELECT * FROM users WHERE id = ?', id, (err, rows) => {
    if (err) {
      console.log('Error in deserialize');
      return done(err);
    }
    const user = rows[0];
    delete user.password;
    console.log('  In deserialize user: ', user);
    return done(null, user);
  });
});

module.exports = {
  authenticate: passport.authenticate(
    'local',
    {
      // successRedirect: '/cars',
      failureRedirect: '/login', //TODO Кастомный колбэк при ошибке для возврата req.flash ???
      failureFlash: true, //connect-flash middleware is needed
    },
  ),
  isUserAuthenticate: isUserAuthenticate,
  initialize: passport.initialize(), //initialize: passport.initialize(),
  session: passport.session(),
  sercetPhrase: '^_^',
};

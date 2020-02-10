/*
  Ivan - 12345678
  Petr - 123
*/

const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const connection = require('./db');

passport.use(new Strategy((username, password, done) => {
  connection.query('SELECT * FROM users WHERE name = ?', username, (err, rows) => {
    if (err) {
      console.log(err);
      return done(err);
    }
    // const user = rows[0];
    const user = {
      id: rows[0].id,
      name: rows[0].name,
      password: rows[0].password,
    };
    if (!user) {
      console.log('Incorrect username.');
      return done(null, false, { message: 'Неверное имя пользователя.' });
    }
    if (password !== user.password) {
      console.log('Incorrect password.');
      return done(null, false, { message: 'Неверный пароль.' });
    }

    console.log('user in done = ', user);
    return done(null, user);
  });
}));

function isUserAuthenticate(req, res, next) {
  console.log('in isUserAuthenticate');
  console.log('req.user: ', req.user);

  debugger
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

// passport.serializeUser((user, done) => {
//   console.log('In serialize');
//   return done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   console.log('In deserialize');
//   connection.query('SELECT * FROM user WHERE id = ?', id, (err, rows) => {
//     if (err) {
//       console.log('Error in deserialize');
//       return done(err);
//     }
//     const user = rows[0];
//     delete user.password;
//     return done(null, user);
//   });
// });

module.exports = {
  authenticate: passport.authenticate('local', {
    successRedirect: '/cars',
    failureRedirect: '/login?error=1',
    // failureFlash: true,  //connect-flash middleware is needed
    session: false,
  }),
  isUserAuthenticate: isUserAuthenticate,
  initialize: passport.initialize(), //initialize: passport.initialize(),
};

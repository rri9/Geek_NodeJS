const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
// const cookieParser = require('cookie-parser');
const logger = require('morgan');
const MySQLStore = require('express-mysql-session')(session);
const db = require('./lib/db');
const sessionStore = new MySQLStore(db.options, db.connection);
const passport = require('./lib/auth');

const app = express();
//Routes
//TODO Собрать маршрутизацию в routes.js, куда подключить все остальные пути
const indexRouter = require('./routes/index');
const carsRouter = require('./routes/cars');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  resave: true,
  saveUninitialized: false,
  secret: passport.sercetPhrase, // ключ
  store: sessionStore,
}));
app.use(flash());

app.use(passport.initialize); //app.use(passport.initialize);
app.use(passport.session);
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/cars', isUserAuthenticate); //app.use('/cars', passport.isUserAuthenticate);
app.use('/cars', carsRouter);
app.use('/logout', require('./routes/logout'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

function isUserAuthenticate(req, res, next) {
  console.log('  In app.js isUserAuthenticate req.user: ', req.user);
  console.log('  In app.js isUserAuthenticate req.passport: ', req.passport);
  console.log('  In app.js isUserAuthenticate req.session: ', req.session);
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

const createError = require('http-errors');
const express = require('express');
// const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const carsRouter = require('./routes/cars');
const loginRouter = require('./routes/login');

const passport = require('./lib/auth');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(session({
//   resave: true,
//   saveUninitialized: false,
//   secret: 'secret phrase', // ключ
// }));

// app.use(passport.initialize); //app.use(passport.initialize);
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/cars', passport.isUserAuthenticate); //app.use('/cars', passport.isUserAuthenticate);
app.use('/cars', carsRouter);


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
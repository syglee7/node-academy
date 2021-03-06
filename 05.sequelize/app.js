var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var rfs = require('rotating-file-stream');
var methodOverride = require('method-override');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var boardRouter = require('./routes/board');

var app = express();
var { sequelize } = require('./models');
//sequelize.sync({force: true}); // 테이블을 만드는 과정
// logger
var logDirectory = path.join(__dirname, 'log');
 
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
 
// create a rotating write stream
var accessLogStream = rfs.createStream('access.log', {
  size: "10M", // rotate every 10 MegaBytes written
  interval: "1d", // rotate daily
  compress: "gzip", // compress rotated files
  path: logDirectory
});
 
// setup the logger
app.use(logger('combined', { stream: accessLogStream }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//미들 웨어 세팅
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/board', boardRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // res.locals 하면 res 에 변수로 등록하는 것
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

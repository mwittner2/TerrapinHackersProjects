var http = require('http');
var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb');
var monk = require('monk');
var MongoStore = require('connect-mongo')(session);
var db = monk('localhost:27017/terrapin-hackers-projects');


var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var register = require('./routes/register');
// var db = require('./db');


var app = express();


// view engine setup

var router = express.Router();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('trust proxy', 1);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'user',
  saveUninitialized: true,
  resave: false,
  cookie: {secure: true},
  store: new MongoStore({
    url: 'mongodb://localhost/terrapin-hackers-projects'
  })
}));



app.use(function(req,res,next){
  req.db = db;
  next();
})





app.use('/', index);
app.use('/users', users);
app.use('/login', login);
app.use('/register', register)



// db.connect('mongodb://localhost:27017/terrapin-hackers-projects', function(err){
//   if (err){
//     console.log('Unable to connect to Mongo.');
//     process.exit(1);
//   }
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

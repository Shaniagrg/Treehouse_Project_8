var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//Using REQUIRE METHOD import sequelize from the folder models/index.js 
const {sequelize} = require('./models/index'); //use {} to pull out just the sequelize connection instance
//async lIFE
( async () => {
  try{
    
    //authenticate() returns a promise that resolves to a successful authenticated connection to database
    await sequelize.authenticate();
    console.log('Connection to the database successful');

    //sync() create the table if it's missing
    await sequelize.sync();
    console.log('Database synced successful')

  }catch(error){
    //it will catch error if something go wrong and tell you the reason why
    console.error('Error connecting to the database', error);
  }
}) ();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const error = new Error(); //create a new Error()

  error.status = 404;
  error.message = 'Sorry! the page you are looking for does not exist';

  console.log(`404 Error: ${error.message}`)

  res.status(404);
  
  //Render the page-not-found template and pass the {error} you're creating as the second parameter 
  res.render('page-not-found', {error});
});

//Global error handler
app.use(function(err, req, res, next){
  err.status = err.status || 500;
  err.message = err.message || "Sorry! there was an unexpected error on the server.";
  console.log(`Global Error: Status ${err.status}, Message: ${err.message}`);

  res.status(err.status);

  //Render the error template and pass the {err} that you're updating as the second parameter 
  res.render('error', {err})
})

module.exports = app;

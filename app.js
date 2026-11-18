var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//Using REQUIRE METHOD load Sequelize instance and models exported by ./models/index.js
const db = require('./models'); 

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//async IIFE
( async () => {
  try{
    
    //authenticate() returns a promise that resolves to a successful authenticated connection to database (checks if Sequelize connect to database)
    await db.sequelize.authenticate();
    console.log('Connection to the database successful');

    //sync() create the table if it's missing
    await db.sequelize.sync();
    console.log('Database synced successful')

  }catch(error){
    //it will catch error if something go wrong and tell you the reason why
    console.error('Error connecting to the database', error);
  }
}) ();

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

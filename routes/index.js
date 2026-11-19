var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/books');
});

const {Book} = require('../models');  //import book model from models folder

//shows all book
router.get('/books', async function(req, res, next) {
  try{
    const books = await Book.findAll({
      //createdAt sequelize automatically add timestamps to all row like when it was created and updated
      //DESC descending like newest to oldest (the new books will added will be on top)
      order: [['createdAt', 'DESC']]
    });

    /*
      'index' goes to the index.pug inside the views folder
      books passes the array of books
      title we use to set the title on the webpage
    */
    res.render('index', {
      books,
      title: 'Books'
    })
  }catch(error){
    next(error);
  }
});


//GET /books/new and display the new book form
router.get('/books/new', async function(req,res, next){
  try{
    res.render('new-book',{
    book:{},
    title: 'New Book'
  });
  }catch(error){
    next(error)
  } 
});

//POST /books/new
//save new book to database
router.post('/books/new', async function(req, res, next){
  try{
    //req.body holds data submitted and create() creates a new row
    await Book.create({
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      year: req.body.year
    });

    //if successful redirect to the book listing
    res.redirect('/books');
  }catch(error){
    //if the input is empty re-render 
    if (error.name === 'SequelizeValidationError'){
      return res.status(400).render('new-book',{
        title: 'New Book',
        book: req.body,
        errors: error.errors
      });
    }
    next(error)
  }
})

module.exports = router;

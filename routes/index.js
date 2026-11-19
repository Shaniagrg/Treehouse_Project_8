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

//Update form for one book
router.get('/books/:id', async function(req,res, next){
  try{
    //req.params.id grabd id number 
    const book = await Book.findByPk(req.params.id);

    //if the book doesn't exist of that ID show 404 page
    if(!book){
      const err = new Error('Book not found');
      err.status = 404;
      return next(err);
    }

    res.render('update-book', {
      book,
      title: 'Update Book'
    });
  }catch(error){
    next(error)
  } 
});

//save the updates
router.post('/books/:id', async function (req, res, next) {
  let book;
  try{
    book = await Book.findByPk(req.params.id);
    
    if(!book){
      const err = new Error('Book not found');
      err.status = 404;
      return next(err);
    }
    //use update() and save changes
    await book.update({
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      year: req.body.year
    });

    res.redirect('/books');
  }catch(error){
    //re-render if title or author is blank
    if (error.name === 'SequelizeValidationError'){
      return res.status(400).render('update-book',{
        title: 'Update Book',
        book: {
          id: req.params.id,
          title: req.body.title,
          author: req.body.author,
          genre: req.body.genre,
          year: req.body.year
        },
        errors: error.errors
      })
    }
    next(error);
  }
});

//delete a book
router.post('/books/:id/delete', async function(req, res, next){
  try{
    const book = await Book.findByPk(req.params.id);

    if(!book){
      const err = new Error('Book not found');
      err.status = 404;
      return next(err);
    }
    //use destroy() to remove the row
    await book.destroy();
    res.redirect('/books');
  }catch(error){
    next(error);
  }
})

module.exports = router;

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/books');
});

const {Book} = require('../models');  //import book model from models folder

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
      title: 'Library Application'
    })
  }catch(error){
    next(error);
  }
});


module.exports = router;

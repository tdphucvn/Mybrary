//Creating routes with express
const express = require('express');
const router = express.Router();
//require Book schema
const Book = require('../models/book');
const Author = require('../models/author');
//allowed image types
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];


//All Books Route
router.get('/', async (req, res) => {
    let query = Book.find();
    if (req.query.title != null && req.query.title != ''){
        query = query.regex('title', new RegExp(req.query.title, 'i'));
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != ''){
        query = query.lte('publishDate', req.query.publishedBefore);
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != ''){
        query = query.gte('publishDate', req.query.publishedAfter);
    }
    try{
        //executes the query above and store the data in variable books
        const books = await query.exec();
        //rendering index.ejs and sending the following params
        res.render('books/index', {
            books: books,
            searchOptions: req.query
        });     
    }catch{
        res.redirect('/books');
    };
});


//New Book Route
router.get('/new', (req, res) => {
   renderNewPage(res, new Book())
});

//Create Book Route
//store the image path 
router.post('/', async (req, res) => {
    //creating an object
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description
    });
    saveCover(book, req.body.cover)
    try{
        //saving the object to database
        const newBook = await book.save();
        res.redirect('books');
    } catch {
        renderNewPage(res, book, true);
    }
});

async function renderNewPage(res, book, hasError = false){
    try{
        //load the list of authors from database
        const authors = await Author.find({});
        //params that will be sent to frontend
        const params = {
            authors: authors,
            book: book
        }
        if (hasError) params.errorMessage = 'Error Creating Book';
        res.render('books/new', params);
    } catch{
        res.redirect('/authors');
    }
}


function saveCover(book, coverEncoded){
    if(coverEncoded == null){
        return
    };
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)){
        book.coverImage = new Buffer.from(cover.data, 'base64');
        book.coverImageType = cover.type
    };
}

module.exports = router;
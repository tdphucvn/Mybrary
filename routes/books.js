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
        res.redirect(`/books/${newBook.id}`);
    } catch {
        renderNewPage(res, book, true);
    }
});

//Show book and all paramas
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('author')
        .exec();//executing the queue
        res.render('books/show', {book: book});
    } catch {
        res.redirect('/');
    };
})

//Edit page
router.get('/:id/edit', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        //using an async function to render the page
        renderEditPage(res, book);
    } catch {
        res.redirect('/');
    };
});

//updating the data in the databse
router.put('/:id', async (req, res) => {
    let book;

    try{
        book = await Book.findById(req.params.id);
        book.title = req.body.title;
        book.author = req.body.author;
        book.publishDate = new Date(req.body.publishDate);
        book.pageCount = req.body.pageCount;
        book.description = req.body.description;
        if (req.body.cover != null && req.body.cover !== ''){
            saveCover(book. req.body.cover);
        };
        await book.save();
        res.redirect(`/books/${book.id}`);
    } catch {
        if (book != null){
            renderNewPage(res, book, true);
        }else{
            res.redirect('/');
        };
    }
});


router.delete('/:id', async (req, res) => {
    let book;
    try {
        book = await Book.findById(req.params.id);
        await book.remove();
        res.redirect('/');
    }catch {
        if (book != null){
            res.render('books/show', {
                book: book,
                errorMessage: 'Could not remove book'
            });
        }else{
            res.redirect('/');
        };
    };
});


async function renderNewPage(res, book, hasError = false){
    renderFormPage(res, book, 'new', hasError);
};

async function renderEditPage(res, book, hasError = false){
    renderFormPage(res, book, 'edit', hasError);
};

async function renderFormPage(res, book, form, hasError = false){
    try{
        //load the list of authors from database
        const authors = await Author.find({});
        //params that will be sent to frontend
        const params = {
            authors: authors,
            book: book
        }
        if (hasError){
            if(form === 'edit'){
                params.errorMessage = 'Error Updating Book';
            }else{
                params.errorMessage = 'Error Creating Book';
            }
        }
        res.render(`books/${form}`, params);
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
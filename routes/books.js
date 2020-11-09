//Creating routes with express
const express = require('express');
const router = express.Router();
//creating a path and storing the data
const multer = require('multer');
//pathing
const path = require('path');
//working with files
const fs = require('fs');
//require Book schema
const Book = require('../models/book');
const Author = require('../models/author');
//path for stored data of imported images
const uploadPath = path.join('public', Book.coverImageBasePath);
//allowed image types
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
//storing path, if the repository is not created yet, it will create one on its own
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        //params err(null in this case), boolean
        callback(null, imageMimeTypes.includes(file.mimetype));
    }
});

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
router.post('/', upload.single('cover'), async (req, res) => {
    //if the req.file is not null then fileName = req.file
    //else req.file.filename: null
    const fileName = req.file != null ? req.file.filename : null;
    //creating an object
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description
    });
    try{
        //saving the object to database
        const newBook = await book.save();
        res.redirect('books');
    } catch {
        if(book.coverImageName != null){
            //remove the stored file due to error
            removeBookCover(book.coverImageName);
        };
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

//removing the path of the image if an error occurs
function removeBookCover(filename) {
    fs.unlink(path.join(uploadPath, filename), err => {
        if (err) console.log(err);
    });
};

module.exports = router;
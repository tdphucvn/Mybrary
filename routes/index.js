//creating router variable with express

const express = require('express');
const router = express.Router();
//connecting the database
const Book = require('../models/book');

//GET method - rendering index.ejs
router.get('/', async (req, res) => {
    //initializing an empty variable books
    let books;
    try {
        //find 10 last added books in the database
        books = await Book.find().sort({createAt: 'desc'}).limit(10).exec();
    } catch {
        books = [];
    };

    //render index.ejs - set in the server.js file
    res.render('index', {books: books});
});

module.exports = router;
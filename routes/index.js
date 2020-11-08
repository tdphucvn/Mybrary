//creating router variable with express

const express = require('express');
const router = express.Router();
const Book = require('../models/book');

//GET method - rendering index.ejs
router.get('/', async (req, res) => {
    let books;
    try {
        books = await Book.find().sort({createAt: 'desc'}).limit(10).exec();
    } catch {
        books = [];
    };

    //render index.ejs - set in the server.js file
    res.render('index', {books: books});
});

module.exports = router;
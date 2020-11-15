//Creating routes with express
const express = require('express');
const router = express.Router();
//require Author schema
const Author = require('../models/author');
const Book = require('../models/book');

//All Authors Route, Searching authors
router.get('/', async (req, res) => {
    //from default is searchOptins an empty object
    let searchOptions = {};
    //query string example: ?name=jo
    if (req.query.name != null && req.query.name !== '') {
        //RegExp strings that contains the part of string above
        //i - insensitive for capitals: JO and jo are the same string
        searchOptions.name = new RegExp(req.query.name, 'i');
    };
    try{
        //finding all authors with the searchOptions, returning all strings that contains the ceartain part
        const authors = await Author.find(searchOptions);
        //rendering authors that contains the string
        //sending bach searchOptions to store it in the search bar
        res.render('authors/index', {authors: authors, searchOptions: req.query});
    } catch{
        //in case of error, redirect back to /authors/
        res.redirect('/');
    };
});


//New Author Route
router.get('/new', (req, res) => {
    //Initializing an Author object
    res.render('authors/new', {author : new Author()});
});

//Create Author Route
router.post('/', async (req, res) => {
    //creating a new Author with the schema created in models
    const author = new Author({
        //find the data with the name "name"
        name: req.body.name
    })
    //async call, mongoose work asynchronously
    try {
        //saving an author to the database
        const newAuthor = await author.save();
        //redirecting 
        res.redirect(`authors/${newAuthor.id}`);
    } catch {
        res.render('authors/new', {
            author: author,
            //throwing an error message
            errorMessage: 'Error creating Author'
        });
    };
});

router.get('/:id', async (req, res) => {
    try{
        const author = await Author.findById(req.params.id);
        const books = await Book.find({author: author.id}).limit(6).exec();
        res.render('authors/show', {
            author:author,
            booksByAuthor: books
        });
    }catch{
        res.redirect('/');
    }
});

router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        res.render('authors/edit', {author : author});
    } catch {
        res.redirect('authors/index');
    };
});

router.put('/:id', async (req, res) => {
        let author;
        //async call, mongoose work asynchronously
        try {
            author = await Author.findById(req.params.id);
            author.name = req.body.name;
            await author.save();
            //redirecting 
            res.redirect(`/authors/${author.id}`);
        } catch {
            if (author == null){
                res.redirect('/');
            }else{
                res.render('authors/new', {
                    author: author,
                    //throwing an error message
                    errorMessage: 'Error Updating'
                });    
            }
        };
});

router.delete('/:id', async (req, res) => {
    let author;
    //async call, mongoose work asynchronously
    try {
        author = await Author.findById(req.params.id);
        await author.remove();
        //redirecting 
        res.redirect('/authors');
    } catch {
        if (author == null){
            res.redirect('/');
        }else{
            Alert('Can not delete an Author with books');
            res.redirect(`/authors/${author.id}`);    
        };
    };
});


module.exports = router;
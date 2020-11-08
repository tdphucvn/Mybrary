//creating router variable with express

const express = require('express');
const router = express.Router();


//GET method - rendering index.ejs
router.get('/', (req, res) => {
    //render index.ejs - set in the server.js file
    res.render('index');
});

module.exports = router;
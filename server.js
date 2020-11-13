//Loading .env file just in developer enviroment
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config({path: '.env'});
};

//Backend library Express
const express = require('express');
//creating an application with express
const app = express();
//using express layouts as frontend
const expressLayouts = require ('express-ejs-layouts');
//requiring database library
const mongoose = require('mongoose');
//requiring bodyparser library for JSON data
const bodyParser = require('body-parser')
//requring libraray for put and delete
const methodOverride = require('method-override');


//Routes
const indexRouter = require('./routes/index');
const authorRouter = require('./routes/authors');
const bookRouter = require('./routes/books');

//Using EJS as view engine
app.set('view engine', 'ejs');
//directory where the template files are located
app.set('views', __dirname + '/views');
//setting the default view
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(methodOverride('_method'));
//Public files CSS/JS
app.use(express.static('public'));
//Parsing to JSON data
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}));

//Middleware routes
app.use('/', indexRouter);
app.use('/authors', authorRouter);
app.use('/books', bookRouter);

//Connection to online cloud database
try{
    mongoose.connect(process.env.DB_CONNECTION, {useUnifiedTopology: true , useNewUrlParser: true}, () => console.log('Success Connection'));
}catch (err){
    console.log('Access denied');
};

const db = mongoose.createConnection();
db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to Mongoose'));

//application listening on port 
app.listen(process.env.PORT || 3000);
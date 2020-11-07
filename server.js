if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config({path: '.env'});
};

const express = require('express');
const app = express();
const expressLayouts = require ('express-ejs-layouts');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));

app.use('/', indexRouter);

try{
    mongoose.connect(process.env.DB_CONNECTION, {useUnifiedTopology: true , useNewUrlParser: true});
}catch (err){
    console.log('Access denied');
};

const db = mongoose.createConnection();
db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to Mongoose'));

app.listen(process.env.PORT || 3000);
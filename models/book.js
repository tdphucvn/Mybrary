//require database library
const mongoose = require('mongoose');
//pathing
const path = require('path');
//saving the img path
const coverImageBasePath = 'uploads/bookCovers';

//creating a schema for saving to database
const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    publishDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number, 
        require: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImageName: {
        type: String,
        required: true
    },
    author: {
        //Required an author object
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Author'
    }
});


//???
bookSchema.virtual('coverImagePath').get(function(){
    if(this.coverImageName != null){
        return path.join('/', coverImageBasePath, this.coverImageName);
    };
});

module.exports = mongoose.model('Book', bookSchema);
module.exports.coverImageBasePath = coverImageBasePath;
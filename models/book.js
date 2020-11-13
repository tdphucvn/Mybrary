//require database library
const mongoose = require('mongoose');

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
    //binary data are stored as buffer type
    coverImage: {
        type: Buffer,
        required: true
    },
    //since we are storing a binery version of the image
    //we need the type (png, jpg...) to parse it back when loading the page
    coverImageType:{
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


//If we required somewhere in the code the following virtual attribute, it will return data as follows
bookSchema.virtual('coverImagePath').get(function(){
    if(this.coverImage != null && this.coverImageType != null){
        //returning the data back when the attribute is called outside the file
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`;
    };
});

module.exports = mongoose.model('Book', bookSchema);

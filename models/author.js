//require database library
const mongoose = require('mongoose');


//creating a schema for saving to database
const authorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Author', authorSchema);
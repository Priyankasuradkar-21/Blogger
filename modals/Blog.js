const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true
    },
    blogTitle : {
        type : String
    },
    blogDescription : {
        type : String
    },
    blogImage : {
        type : String
    },
    likes : [],
    comments : [{
        email : String,
        comment : String
    }]
})

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;
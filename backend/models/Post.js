const mongoose = require('mongoose');

const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let postSchema = new mongoose.Schema({
    creator: {type: String, required: REQUIRED_VALIDATION_MESSAGE},
    source: { data: Buffer, contentType: String},
    description: {type:String, required: REQUIRED_VALIDATION_MESSAGE},
    likesCount: Number,
    likesUsers: [{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    comments: [{type:mongoose.Schema.Types.ObjectId,ref:'Comment'}],
});

let Post = mongoose.model('Post',postSchema);

module.exports = Post;
const mongoose = require('mongoose');

const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let postSchema = new mongoose.Schema({
    creator: {type:mongoose.Schema.Types.ObjectId,ref:'User', required: REQUIRED_VALIDATION_MESSAGE},
    source: { data: Buffer, contentType: String},
    smallSource: { data: Buffer, contentType: String},
    description: {type:String, required: REQUIRED_VALIDATION_MESSAGE},
    likesCount: Number,
});

let Post = mongoose.model('Post',postSchema);

module.exports = Post;
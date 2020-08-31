const mongoose = require('mongoose');

const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let CommentSchema = new mongoose.Schema({
    parentComment: {type:mongoose.Schema.Types.ObjectId,ref:'Comment'},
    likesCount: Number,
    post:    {type:mongoose.Schema.Types.ObjectId,ref:'Post',required: REQUIRED_VALIDATION_MESSAGE},
    content: {type:String, required: REQUIRED_VALIDATION_MESSAGE},
    creator: {type: mongoose.Schema.Types.ObjectId, ref:'User',required: REQUIRED_VALIDATION_MESSAGE},
    created: {type:Date, default: Date.now },
});

let Comment = mongoose.model('Comment',CommentSchema);

module.exports = Comment;
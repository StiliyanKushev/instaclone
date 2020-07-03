const { mongoose } = require("mongoose");

const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let CommentSchema = new mongoose.Schema({
    content: {type:String, required: REQUIRED_VALIDATION_MESSAGE},
    creator: {type:String, required: REQUIRED_VALIDATION_MESSAGE},
    created: {type:Date, default: Date.now },
});

let Comment = mongoose.model('Comment',CommentSchema);

module.exports = Comment;
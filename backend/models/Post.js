const mongoose = require('mongoose');
const paginator = require('mongoose-paginate-v2');

const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let postSchema = new mongoose.Schema({
    creator: {type:mongoose.Schema.Types.ObjectId,ref:'User', required: REQUIRED_VALIDATION_MESSAGE},
    source: { data: Buffer, contentType: String},
    smallSource: { data: Buffer, contentType: String},
    description: {type:String, required: REQUIRED_VALIDATION_MESSAGE},
    createdAt: { type: Date, default: Date.now },
    likesCount: Number,
});

// add support for pagination
postSchema.plugin(paginator);

let Post = mongoose.model('Post',postSchema);

module.exports = Post;
const mongoose = require('mongoose');

let UserLikeSchema = new mongoose.Schema({
    // post:   {type:mongoose.Schema.Types.ObjectId,ref:'Post'},
    // user:   {type:mongoose.Schema.Types.ObjectId,ref:'User'}
    post_id: String,
    username: String,
    uniqueCombo: String // post_id + username
});

let UserLike = mongoose.model('UserLike',UserLikeSchema);

module.exports = UserLike;
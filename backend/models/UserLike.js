const mongoose = require('mongoose');

let UserLikeSchema = new mongoose.Schema({
    post_id: String,
    username: String,
});

let UserLike = mongoose.model('UserLike',UserLikeSchema);

module.exports = UserLike;
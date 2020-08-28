const mongoose = require('mongoose');

let UserLikeSchema = new mongoose.Schema({
    post_id: String,
    user: {type:mongoose.Schema.Types.ObjectId,ref:'User'},
});

let UserLike = mongoose.model('UserLike',UserLikeSchema);

module.exports = UserLike;
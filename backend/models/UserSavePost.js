const mongoose = require('mongoose');

let UserSavePostSchema = new mongoose.Schema({
    post: {type:mongoose.Schema.Types.ObjectId,ref:'Post'},
    user: {type:mongoose.Schema.Types.ObjectId,ref:'User'},
});

let UserSavePost = mongoose.model('UserSavePost',UserSavePostSchema);

module.exports = UserSavePost;
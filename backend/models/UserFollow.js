const mongoose = require('mongoose');

let UserFollowSchema = new mongoose.Schema({
    fromUser: {type:mongoose.Schema.Types.ObjectId,ref:'User'},
    toUser: {type:mongoose.Schema.Types.ObjectId,ref:'User'},
});

let UserFollow = mongoose.model('UserFollow',UserFollowSchema);

module.exports = UserFollow;
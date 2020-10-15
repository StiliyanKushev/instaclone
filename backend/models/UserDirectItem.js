const mongoose = require('mongoose');

const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let userDirectItemSchema = new mongoose.Schema({
    forUser: {type:mongoose.Schema.Types.ObjectId,ref:'User',required:REQUIRED_VALIDATION_MESSAGE},
    asUser: {type:mongoose.Schema.Types.ObjectId,ref:'User',required:REQUIRED_VALIDATION_MESSAGE},
});

let userDirectItem = mongoose.model('UserDirectItem',userDirectItemSchema);

module.exports = userDirectItem;
const mongoose = require('mongoose');

const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let ChatMsgSchema = new mongoose.Schema({
    name: {type: String, required: REQUIRED_VALIDATION_MESSAGE},
    text: {type: String, required: REQUIRED_VALIDATION_MESSAGE},
    created: {type:Date, default: Date.now },
});

let ChatMsg = mongoose.model('ChatMsg',ChatMsgSchema);

module.exports = ChatMsg;
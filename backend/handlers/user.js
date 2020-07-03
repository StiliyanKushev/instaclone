const User = require("../models/User");
const fs = require('fs');
const path = require('path');

function sendAvatar(req, res, next) {
    //validation of username string
    const username = req.headers.username;
    if (!username || typeof username !== 'string' || username.trim().length < 5 || username.trim().length > 20) {
        return res.status(200).json({
            success: false,
            messege: 'Username must be between 5 and 20 chars long.'
        })
    }

    //validation of the file
    if (!req.file) {
        return res.status(200).json({
            success: false,
            messege: 'File not uploaded.'
        })
    }

    if (!req.file.mimetype || (req.file.mimetype.indexOf('jpg') === -1 &&
            req.file.mimetype.indexOf('jpeg') === -1 &&
            req.file.mimetype.indexOf('png') === -1)) {
        return res.status(200).json({
            success: false,
            messege: 'Uploaded file type is not supported yet.'
        })
    }

    //validate if user with username exists
    User.findOne({
        username
    }).then(user => {
        if (!user) {
            return res.status(200).json({
                success: false,
                messege: 'Cannot set avatar to unexisting user.'
            })
        }

        let imgPath = path.dirname(require.main.filename || process.mainModule.filename) + '/' + req.file.path;

        const avatarImg = {
            data: fs.readFileSync(imgPath),
            contentType: req.file.mimetype,
        }

        User.updateOne({ username }, {avatarImg}).then(() => {
            res.status(200).json({
                success: true,
                messege: 'New avatar has been set.'
            })
        }).catch(() => {
            res.status(200).json({
                success: false,
                messege: 'There was an internal error.'
            })
        });
    });
}

module.exports = {
    sendAvatar
}
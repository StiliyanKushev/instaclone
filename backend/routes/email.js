const User = require('../models/User');
const router = require('express').Router();
const nodemailer = require("nodemailer");
const validator = require('validator');
const encryption = require('../utilities/encryption');

function generatePassword() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'instaclonesender@gmail.com',
        pass: 'instaclonereceiver'
    }
});

let mailOptions = {
    from: 'instaclonesender@gmail.com',
    to: 'instaclonereceiver@gmail.com',
    subject: '',
    text: ''
};

router.post('/forgot-password', (req, res, next) => {
    if (!validator.isEmail(req.body.email)) {
        return res.status(200).json({
            success: false,
            messege: 'Please provide a correct email.',
        })
    }

    User.findOne({email:req.body.email}).then(user => {
        if(!user){
            return res.status(200).json({
                success: false,
                messege: 'A user with this email does not exist',
            })
        }
        else{
            let salt = encryption.generateSalt()
            let rawPassword = generatePassword();
            let password = encryption.generateHashedPassword(salt, rawPassword)
        
            User.updateOne({email:req.body.email},{salt,password},() => {
                let opts = {
                    ...mailOptions
                };
                opts.to = req.body.email.trim().toLowerCase();
                opts.text = 'Hello user. Your new password is:' + rawPassword;
                opts.subject = `YOUR NEW PASSWORD FOR INSTA(CLONE)`;

                transporter.sendMail(opts, function (error, info) {
                    if (error) {
                        res.status(200).json({
                            success: false,
                            messege: 'There was an error while sending the new password. Try again later.'
                        });
                    } else {
                        res.status(200).json({
                            success: true,
                            messege: 'A new password has been sent to your email.'
                        });
                    }
                });
            });
        }
    });
})

router.post('/report-bug', (req, res, next) => {
    const username = req.body.username;
    const text = req.body.report;

    User.findOne({
        username
    }).then(user => {
        if (!user) {
            res.status(200).json({
                success: false,
                messege: 'There was an error fetching the user data.'
            });
        } else {
            let opts = {
                ...mailOptions
            };
            opts.text = text;
            opts.subject = `Username: ${username} REPORTS A BUG`;

            transporter.sendMail(opts, function (error, info) {
                if (error) {
                    res.status(200).json({
                        success: false,
                        messege: 'There was an error sending the email. Try again later.'
                    });
                } else {
                    res.status(200).json({
                        success: true,
                        messege: 'Your report has been sent to our specialists to analyze.'
                    });
                }
            });
        }
    });
});

module.exports = router;
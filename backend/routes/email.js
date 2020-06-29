const User = require('../models/User');
const router = require('express').Router();
const nodemailer = require("nodemailer");

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

router.post('/report-bug', (req, res, next) => {
    const username = req.body.username;
    const text = req.body.report;

    User.findOne({username}).then(user => {
        if(!user){
            res.status(200).json({
                success: false,
                messege: 'There was an error fetching the user data.'
            });
        }
        else{
            let opts = {...mailOptions};
            opts.text = text;
            opts.subject = `Username: ${username} REPORTS A BUG`;

            transporter.sendMail(opts, function(error, info){
                if (error) {
                    res.status(200).json({
                        success: false,
                        messege: 'There was an error sending the email. Try again later.'
                    });
                } else {
                    res.status(200).json({
                        success:true,
                        messege: 'Your report has been sent to our specialists to analyze.'
                    });
                }
              });
        }
    });
});

module.exports = router;
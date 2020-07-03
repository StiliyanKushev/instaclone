const User = require("../models/User")
const Post = require("../models/Post")
const jwt = require('jsonwebtoken');

const fs = require('fs'); 
const path = require('path'); 

function validateCreatePost(payload){
    const errors = {}
    let isFormValid = true
    let messege = ''
  
    if (!payload || typeof payload.username !== 'string' || payload.username.trim().length < 5 || payload.username.trim().length > 20) {
      isFormValid = false
      errors.username = 'Creator username must be between 5 and 20 chars long.'
    }

    if(!payload || typeof payload.description !== 'string' || payload.description.trim().length < 5 || payload.description.trim().length > 300){
        isFormValid = false
        errors.description = 'Description should be between 5 and 300 charachters long.'
    }
    
    if (!isFormValid) {
      messege = 'Check the form for errors.'
    }
  
    return {
      success: isFormValid,
      messege,
      errors
    }
  }

function createPost(req, res, next) {
    const validationResult = validateCreatePost({username:req.headers.username,description:req.body.description})
    if (!validationResult.success) {
        return res.status(200).json({
            success: false,
            messege: validationResult.messege,
            errors: validationResult.errors
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

    User.findOne({username:req.headers.username}).then(user => {
        if(!user){
            return res.status(200).json({
                success:false,
                messege: 'The user trying to create a post is not valid.'
            })
        }

        const tempToken = jwt.sign(user.id,'s0m3 r4nd0m str1ng')

        //check if user is the one from the username's user id
        if(tempToken !== req.headers.token){
            return res.status(401).end('Cannot create a post for different account');
        }

        let imgPath = path.dirname(require.main.filename || process.mainModule.filename) + '/' + req.file.path;

        new Post({
            creator: req.headers.username,
            source: {
                data: fs.readFileSync(imgPath),
                contentType: req.file.mimetype,
            },
            description:req.body.description,
            likesCount: 0
        }).save().then(post => {
            return res.status(200).json({
                success:true,
                messege:'Post uploaded successfully.'
            });
        }).catch(err => {
            console.log(err);
        });
    })
}

module.exports = {
    createPost
}
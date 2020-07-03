const User = require("../models/User")
const Post = require("../models/Post")

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
    const validationResult = validateCreatePost(req.body)
    if (!validationResult.success) {
        return res.status(200).json({
            success: false,
            messege: validationResult.messege,
            errors: validationResult.errors
        })
    }

    User.findOne({username:req.body.username}).then(user => {
        if(!user){
            return res.status(200).json({
                success:false,
                messege: 'The user trying to create a post is not valid.'
            })
        }

        new Post({
            creator: req.body.username,
            source: {
                data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
                contentType: 'image/png',
                description:req.body.description
            }
        }).save().then(post => {
            console.log(post);
        }).catch();

    })
}

module.exports = {
    createPost
}
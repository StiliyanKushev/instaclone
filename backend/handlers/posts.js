const User = require("../models/User");
const Post = require("../models/Post");
const UserLike = require("../models/UserLike");
const Comment = require("../models/Comment");
const jwt = require('jsonwebtoken');

const fs = require('fs'); 
const path = require('path'); 
const sharp = require('sharp');

function validateCreateAndCommentPost(payload){
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

function validateLikePost(payload){
    const errors = {}
    let isFormValid = true
    let messege = ''
  
    if (!payload || typeof payload.username !== 'string' || payload.username.trim().length < 5 || payload.username.trim().length > 20) {
      isFormValid = false
      errors.username = 'Creator username must be between 5 and 20 chars long.'
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

async function createPost(req, res, next) {
    const validationResult = validateCreateAndCommentPost({username:req.headers.username,description:req.body.description})
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

    User.findOne({username:req.headers.username}).then(async (user) => {
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

        let imageName = req.file.filename;
        let originalImgPath = path.dirname(require.main.filename || process.mainModule.filename) + '/' + req.file.path;
        let resizedImgPath = path.dirname(require.main.filename || process.mainModule.filename) + '/resized/' + imageName;

        await sharp(originalImgPath)
        .resize(500)
        .toFile(
            path.resolve(path.dirname(require.main.filename || process.mainModule.filename),'resized',imageName)
        )

        //remove original image after resized is created
        fs.unlinkSync(originalImgPath);

        new Post({
            creator: req.headers.username,
            source: {
                data: fs.readFileSync(resizedImgPath),
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
            return res.status(200).json({
                success:false,
                messege:'Image size is too large. GridFS will be implemented soon. :('
            });
        });
    })
}

function commentPost(req,res,next){
    const validationResult = validateCreateAndCommentPost({username:req.body.username,description:req.body.description})
    if (!validationResult.success) {
        return res.status(200).json({
            success: false,
            messege: validationResult.messege,
            errors: validationResult.errors
        })
    }

    User.findOne({username:req.body.username}).then(async (user) => {
        if(!user){
            return res.status(200).json({
                success:false,
                messege: 'The user trying to comment a post is not valid.'
            })
        }

        const tempToken = jwt.sign(user.id,'s0m3 r4nd0m str1ng')

        //check if user is the one from the username's user id
        if(tempToken !== req.headers.token){
            return res.status(401).end('Cannot comment a post for different account');
        }


        Post.findOne({_id:req.params.id}).then(post => {
            if(!post){
                return res.status(200).json({
                    success:false,
                    messege: 'Cannot comment on post that does not exist.'
                })
            }

            new Comment({
                post: post,
                creator:req.body.username,
                content:req.body.description
            }).save().then(comment => {
                return res.status(200).json({
                    success:true,
                    messege:'Comment added.'
                })
            }).catch(err => {
                console.log(err);
                return res.status(200).json({
                    success:false,
                    messege:'Could not add comment to the post.'
                });
            });
        })
    })
}

async function getCommentsFromPost(req,res,next){
    let startIndex = Number(req.params.startIndex);
    let stopIndex = Number(req.params.stopIndex);

    let postId = req.params.id;

    let limit = stopIndex - startIndex;
    if(limit === 0) limit = 1;

    Comment.find({post:postId}).skip(startIndex).limit(limit).exec(async (err,commnents) => {
        if(err){
            console.log(err);
            return res.status(200).json({
                success:false,
                comments:[]
            })
        }

        return res.status(200).json({
            success:true,
            comments:commnents
        })
    })
}

async function getPopularFromAllPost(req,res,next){
    let startIndex = Number(req.params.startIndex);
    let stopIndex = Number(req.params.stopIndex);
    
    let limit = stopIndex - startIndex;
    if(limit === 0) limit = 1;

    Post.find().skip(startIndex).limit(limit).sort({likesCount:'desc'}).exec(async (err,posts) => {
        if(err){
            console.log(err);
            return res.status(200).json({
                success:false,
                posts:[]
            })
        }

        let resPosts = [];

        for(let post of posts){
            let allComments = await Comment.find({post:post}).limit(3).exec();
            
            // sort the comments 
            let comments = [];
            let ownComments = [];
            for(let comment of allComments){
                if(comment.creator === req.params.username){
                    ownComments.push(comment);
                }
                else{
                    comments.push(comment);
                }
            }

            let isLikedQ = await UserLike.find({post_id:post._id,username:req.params.username});
            let isLiked = isLikedQ[0] === undefined ? false : true;

            let newPost = {
                _id:post._id,
                creator: post.creator,
                source: post.source,
                description: post.description,
                likesCount: post.likesCount,
                likesUsers: post.likesUsers,
                comments: comments,
                ownComments:ownComments,
                isLiked: isLiked
            }

            resPosts.push(newPost);
        }
        
        return res.status(200).json({
            success:true,
            posts:resPosts
        })
    })
}

function likePost(req,res,next){
    const validationResult = validateLikePost({username:req.body.username})
    if (!validationResult.success) {
        return res.status(200).json({
            success: false,
            messege: validationResult.messege,
            errors: validationResult.errors
        })
    }

    User.findOne({username:req.body.username}).then(async (user) => {
        if(!user){
            return res.status(200).json({
                success:false,
                messege: 'The user trying to comment a post is not valid.'
            })
        }

        const tempToken = jwt.sign(user.id,'s0m3 r4nd0m str1ng')

        //check if user is the one from the username's user id
        if(tempToken !== req.headers.token){
            return res.status(401).end('Cannot comment a post for different account');
        }

        Post.findOne({_id:req.params.id}).then(async (post) => {
            if(!post){
                return res.status(200).json({
                    success:false,
                    messege: 'Cannot like a post that does not exist.'
                })
            }

            let isAlreadyLiked = await UserLike.findOne({post_id:post._id,username:user.username});
            
            // like it now
            if(!isAlreadyLiked){
                post.likesCount++;
                post.save();

                new UserLike({post_id:post._id,username:user.username}).save().then(userLike => {
                    return res.status(200).json({
                        success:true,
                        messege: 'Post liked.'
                    })
                }).catch(err => {
                    console.log(err);
                    return res.status(200).json({
                        success:false,
                        messege:'internal error. Could not add user to user likes.'
                    })
                })
            }
            //unlike it now
            else{
                post.likesCount--;
                post.save();

                UserLike.find({post_id:post._id,username:user.username}).remove().exec().then(() => {
                    return res.status(200).json({
                        success:true,
                        messege: 'Post unliked.'
                    })
                }).catch(err => {
                    console.log(err);
                    return res.status(200).json({
                        success:false,
                        messege:'internal error. Could not remove user from user likes.'
                    })
                })
            }
        })
    })
}

module.exports = {
    createPost,
    getPopularFromAllPost,
    getCommentsFromPost,
    commentPost,
    likePost
}
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

        let creatorUser = await User.findOne({username:req.headers.username});

        new Post({
            creator: creatorUser,
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
            console.log(err);
            return res.status(200).json({
                success:false,
                messege:'Image size is too large. GridFS will be implemented soon. :('
            });
        });
    })
}

function commentPost(req,res,next){
    const validationResult = validateCreateAndCommentPost({description:req.body.description})
    if (!validationResult.success) {
        return res.status(200).json({
            success: false,
            messege: validationResult.messege,
            errors: validationResult.errors
        })
    }

    User.findById(req.body.userId).then(async (user) => {
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
                creator:user.id,
                content:req.body.description
            }).save().then(async (comment) => {
                let commentCreator = await User.findById(comment.creator);
                return res.status(200).json({
                    success:true,
                    messege:'Comment added.',
                    comment:{
                        content: comment.content,
                        id:      comment.id,
                        post:    comment.post.id,
                        creator: {
                            id: commentCreator.id,
                            username: commentCreator.username,
                        }
                    }
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

    Comment.find({post:postId}).skip(startIndex).limit(limit).exec(async (err,comments) => {
        if(err){
            console.log(err);
            return res.status(200).json({
                success:false,
                comments:[]
            })
        }

        let newComments = [];

        for(let comment of comments){
            let commentCreator = await User.findById(comment.creator);

            newComments.push({
                id: comment.id,
                post: comment.post.toString(),
                content: comment.content,
                creator: {
                    id: commentCreator.id,
                    username: commentCreator.username,
                }
            });
        }

        return res.status(200).json({
            success:true,
            comments:newComments
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
                // append creator username to every comment
                let commentCreator = await User.findById(comment.creator);

                let newComment = {
                    post:    comment.post,
                    id:      comment.id,
                    content: comment.content,
                    creator: {
                        id: comment.creator,
                        username: commentCreator.username,
                    },
                }

                if(comment.creator.toString() === req.params.userId){
                    ownComments.push(newComment);
                }
                else{
                    comments.push(newComment);
                }
            }

            let givenUser = await User.findById(req.params.userId);

            let isLikedQ = await UserLike.find({item_id:post._id,user:givenUser});
            let isLiked = isLikedQ[0] === undefined ? false : true;

            let postCreator = await User.findById(post.creator);

            let newPost = {
                _id:post._id,
                creator: {id:postCreator.id,username:postCreator.username},
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
    User.findById(req.body.userId).then(async (user) => {
        if(!user){
            return res.status(200).json({
                success:false,
                messege: 'The user trying to comment a post is not valid.'
            })
        }

        const tempToken = jwt.sign(user.id,'s0m3 r4nd0m str1ng')

        //check if user is the one from the username's user id
        if(tempToken !== req.headers.token){
            return res.status(401).end('Cannot comment a post from different account');
        }

        Post.findOne({_id:req.params.id}).then(async (post) => {
            if(!post){
                return res.status(200).json({
                    success:false,
                    messege: 'Cannot like a post that does not exist.'
                })
            }

            let isAlreadyLiked = await UserLike.findOne({item_id:post._id,user:user});
            
            // like it now
            if(!isAlreadyLiked){
                post.likesCount++;
                post.save();

                new UserLike({item_id:post._id,user:user}).save().then(userLike => {
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

                UserLike.find({item_id:post._id,user:user}).remove().exec().then(() => {
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
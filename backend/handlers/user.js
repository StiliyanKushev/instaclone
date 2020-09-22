const User = require("../models/User");
const fs = require('fs');
const path = require('path');
const Post = require("../models/Post");
const jwt = require('jsonwebtoken');
const UserSavePost = require("../models/UserSavePost");
const sharp = require('sharp');
const UserFollow = require("../models/UserFollow");

async function getSuggestedUsers(req,res,next){
    User.count().exec(async function (err, count) {

        const userId = req.params.userId;

        // verify the user
        let user = await User.findById(userId)

        if(!user){
            return res.status(200).json({
                success: false,
                messege: 'There was an error with fetching. Invalid userid given.',
                users:[]
            })
        }


        // Get a random entry
        var randomIndex = Math.floor(Math.random() * count - 5)
        if(randomIndex < 0) randomIndex = 0;
        
        User.find({_id: { $ne: user._id }}).skip(randomIndex).limit(5).exec(async (err,users) => {
            let newUsers = [];

            for(let current_user of users){
                let isFollowed = await UserFollow.findOne({fromUser:user,toUser:current_user})

                newUsers.push({
                    id: current_user._id,
                    username: current_user.username,
                    isFollowed: isFollowed
                })
            }

            // here we have at least 5 users
            return res.status(200).json({
                success:true,
                messege:'Here are some new friends!',
                users: newUsers
            });
        })
    })
}

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
    }).then(async (user) => {
        if (!user) {
            return res.status(200).json({
                success: false,
                messege: 'Cannot set avatar to unexisting user.'
            })
        }

        let filename = req.file.path.slice(8);

        let imgPath = path.dirname(require.main.filename || process.mainModule.filename) + '/uploads/' + filename;
        let resizedImgPath = path.dirname(require.main.filename || process.mainModule.filename) + '/resized/' + filename;

        await sharp(imgPath)
        .resize(100)
        .toFile(
            path.resolve(path.dirname(require.main.filename || process.mainModule.filename),'resized',filename)
        )

        const avatarImg = {
            data: fs.readFileSync(resizedImgPath),
            contentType: req.file.mimetype,
        }

        User.updateOne({ username }, {avatarImg}).then(() => {
            fs.unlinkSync(imgPath)
            fs.unlinkSync(resizedImgPath)
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

async function getUserPostsRecent(req,res,next){
    let startIndex = Number(req.params.startIndex);
    let stopIndex = Number(req.params.stopIndex);

    let givenUser = await User.find({username:req.params.userId});

    Post.count({creator:givenUser}).exec(async function (err, count) {
        let limit = stopIndex - startIndex
        
        if(startIndex >= count){
            return res.status(200).json({
                success:true,
                posts:[]
            })
        }

        if(stopIndex >= count){
            limit = count - startIndex
        }

        Post.find({creator:givenUser}).skip(startIndex).limit(limit).sort({date: 'asc'}).exec(async (err,posts) => {
            if(err){
                console.log(err);
                return res.status(200).json({
                    success:false,
                    posts:[]
                })
            }

            let newPosts = [];

            for(let post of posts){
                newPosts.push({
                    _id:post.id,
                    likesCount:post.likesCount,
                    source:post.smallSource,
                })
            }

            return res.status(200).json({
                success:true,
                posts:newPosts,
            })
        })
    })
}

async function getUserPostsPopular(req,res,next){
    let startIndex = Number(req.params.startIndex);
    let stopIndex = Number(req.params.stopIndex);

    let givenUser = await User.find({username:req.params.userId});

    Post.find({creator:givenUser}).skip(startIndex).limit(stopIndex - startIndex).sort({likesCount:'desc'}).exec(async (err,posts) => {
        if(err){
            console.log(err);
            return res.status(200).json({
                success:false,
                posts:[]
            })
        }

        let newPosts = [];

        for(let post of posts){
            newPosts.push({
                _id:post.id,
                likesCount:post.likesCount,
                source:post.smallSource,
            })
        }

        return res.status(200).json({
            success:true,
            posts:newPosts,
        })
    })
}

async function getUserPostsSaved(req,res,next){
    let startIndex = Number(req.params.startIndex);
    let stopIndex = Number(req.params.stopIndex);

    let givenUser = await User.find({username:req.params.userId});

    UserSavePost.find({user:givenUser}).skip(startIndex).limit(stopIndex - startIndex).exec(async (err,savedPostsModls) => {
        if(err){
            console.log(err);
            return res.status(200).json({
                success:false,
                posts:[]
            })
        }

        if(savedPostsModls.length === 0){
            return res.status(200).json({
                success:true,
                posts:[]
            })
        }

        let newPosts = []

        for(let modl of savedPostsModls){
            let currentPost = await Post.findById(modl.post);
            newPosts.push({
                _id:currentPost.id,
                likesCount:currentPost.likesCount,
                source:currentPost.smallSource,
            })
        }

        return res.status(200).json({
            success:true,
            posts:newPosts,
        })
    })
}

function userSavePost(req,res,next){
    User.findById(req.body.userId).then(async (user) => {
        if(!user){
            return res.status(200).json({
                success:false,
                messege: 'The user trying to save a post is not valid.'
            })
        }

        const tempToken = jwt.sign(user.id,'s0m3 r4nd0m str1ng')

        //check if user is the one from the username's user id
        if(tempToken !== req.headers.token){
            return res.status(401).end('Cannot save a post from different account');
        }

        Post.findOne({_id:req.params.id}).then(async (post) => {
            if(!post){
                return res.status(200).json({
                    success:false,
                    messege: 'Cannot save a post that does not exist.'
                })
            }

            let isAlreadySaved = await UserSavePost.findOne({post:post._id,user:user});
            
            // like it now
            if(!isAlreadySaved){
                new UserSavePost({post:post._id,user:user}).save().then(userLike => {
                    return res.status(200).json({
                        success:true,
                        messege: 'Post saved.'
                    })
                }).catch(err => {
                    console.log(err);
                    return res.status(200).json({
                        success:false,
                        messege:'internal error. Could not add user to user saved posts.'
                    })
                })
            }
            //unlike it now
            else{
                UserSavePost.find({post:post._id,user:user}).remove().exec().then(() => {
                    return res.status(200).json({
                        success:true,
                        messege: 'Post unsaved.'
                    })
                }).catch(err => {
                    console.log(err);
                    return res.status(200).json({
                        success:false,
                        messege:'internal error. Could not remove user from user post saves.'
                    })
                })
            }
        })
    })
}

async function getUserData(req,res,next){
    let username = req.params.username;
    let userId = req.params.userId;

    let userToGet = await User.find({username});
    let asUser = await User.findById(userId);

    if(!userToGet || !asUser){
        return res.status(200).json({
            success:false,
            messege:'internal error. Could not fetch user data. Invalid user given.'
        })
    }

    let postsNum = await Post.count({creator:userToGet});
    let followersNum = await UserFollow.count({toUser:userToGet});
    let followingNum = await UserFollow.count({fromUser:userToGet});
    let isFollowing = !!await UserFollow.findOne({fromUser:asUser,toUser:userToGet});

    return res.status(200).json({
        success:true,
        user:{
            posts: postsNum,
            followers: followersNum,
            following: followingNum,
            isFollowing: isFollowing,
        }
    })
}

async function userFollow(req,res,next){
    let username = req.params.username;
    let userId = req.body.userId;

    let userToGet = await User.findOne({username});
    let asUser = await User.findById(userId);

    if(!userToGet || !asUser){
        return res.status(200).json({
            success:false,
            messege:'internal error. Invalid user given.'
        })
    }

    let alreadyFollowed = await UserFollow.findOne({fromUser:asUser, toUser:userToGet});

    if(alreadyFollowed){
        return res.status(200).json({
            success:false,
            messege:'User is alredy followed once.'
        });
    }

    new UserFollow({
        fromUser:asUser,
        toUser:userToGet,
    }).save().then(userFollow => {
        return res.status(200).json({
            success:true,
            messege:'User followed successfully.'
        });
    }).catch(err => {
        console.log(err);
        return res.status(200).json({
            success:false,
            messege:'There was an error following a user.'
        });
    });
}

async function userUnfollow(req,res,next){
    let username = req.params.username;
    let userId = req.body.userId;

    let userToGet = await User.find({username});
    let asUser = await User.findById(userId);

    if(!userToGet || !asUser){
        return res.status(200).json({
            success:false,
            messege:'internal error. Invalid user given.'
        })
    }

    let alreadyFollowed = await UserFollow.findOne({fromUser:asUser, toUser:userToGet});

    if(!alreadyFollowed){
        return res.status(200).json({
            success:false,
            messege:'User is not followed.'
        });
    }

    let usrFollow = await UserFollow.findOne({fromUser:asUser,toUser:userToGet});

    if(!usrFollow){
        return res.status(200).json({
            success:false,
            messege:'There was an error unfollowing a user.'
        });
    }

    UserFollow.deleteOne({fromUser:asUser,toUser:userToGet}).then(() => {
        return res.status(200).json({
            success:true,
            messege:'User unfollowed successfully.'
        });
    }).catch(err => {
        console.log(err);
        return res.status(200).json({
            success:false,
            messege:'There was an error unfollowing a user.'
        });
    })
}

module.exports = {
    sendAvatar,
    getSuggestedUsers,
    getUserPostsRecent,
    getUserPostsPopular,
    getUserPostsSaved,
    userSavePost,
    getUserData,
    userUnfollow,
    userFollow,
}
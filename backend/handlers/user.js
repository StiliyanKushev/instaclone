const User = require("../models/User");
const fs = require('fs');
const path = require('path');
const Post = require("../models/Post");
const { start } = require("repl");

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

            for(let user of users){
                newUsers.push({
                    id: user._id,
                    username: user.username
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


async function getUserPostsRecent(req,res,next){
    let startIndex = Number(req.params.startIndex);
    let stopIndex = Number(req.params.stopIndex);

    let givenUser = await User.findById(req.params.userId);

    Post.find({creator:givenUser}).skip(startIndex).limit(stopIndex - startIndex).sort({date: 'asc'}).exec(async (err,posts) => {
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
                source:post.source,
            })
        }

        return res.status(200).json({
            success:true,
            posts:newPosts,
        })
    })
}

async function getUserPostsPopular(req,res,next){
    let startIndex = Number(req.params.startIndex);
    let stopIndex = Number(req.params.stopIndex);

    let givenUser = await User.findById(req.params.userId);

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
                source:post.source,
            })
        }

        return res.status(200).json({
            success:true,
            posts:newPosts,
        })
    })
}

function getUserPostsSaved(req,res,next){
    // todo
}

module.exports = {
    sendAvatar,
    getSuggestedUsers,
    getUserPostsRecent,
    getUserPostsPopular,
    getUserPostsSaved
}
const router = require('express').Router();
const authCheck = require('../config/auth-check');
const {getCommentsFromComment,createPost,getPopularFromAllPost,commentPost,likePost,likeComment,getCommentsFromPost,getLikesFromPost,getLikesFromComment} = require('../handlers/posts');
const {sendAvatar,getSuggestedUsers} = require('../handlers/user');
const multer = require('multer'); 
const User = require('../models/User');
const Post = require('../models/Post');
let storage = multer.diskStorage({ 
    destination: (req, file, cb) => { 
        cb(null, 'uploads') 
    }, 
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now()) 
    } 
}); 
let upload = multer({ storage: storage }); 

router.get('/photo/user/:username',(req,res,next) => {
    let username = req.params.username;
    if (!username || typeof username !== 'string' || username.trim().length < 5 || username.trim().length > 20) {
        return res.status(404).send('not found')
    }

    User.findOne({username}).then(user => {
        if(!user){
            return res.status(404).send('not found')
        }

        res.contentType(user.avatarImg.contentType);
        return res.send(user.avatarImg.data);
    });
})

router.get('/photo/post/:id',(req,res,next) => {
    let id = req.params.id;

    Post.findOne({_id:id}).then(post => {
        if(!post){
            return res.status(404).send('not found')
        }

        res.contentType(post.source.contentType);
        return res.send(post.source.data);
    });
})

//posts
// router.get('/posts/get/user/recent/:index/:length',authCheck,getRecentFromUserPost)
// router.get('/posts/get/user/popular/:index/:length',authCheck,getPopularFromUserPost)
router.get('/posts/get/all/popular/:startIndex/:stopIndex/as/:userId',authCheck,getPopularFromAllPost)
// router.get('/posts/:id/get',authCheck,getPost)
router.post('/posts/create',authCheck,upload.single('image'),createPost)
// router.delete('/posts/:id/delete',authCheck,deletePost)
router.get('/posts/:id/comments/:startIndex/:stopIndex/as/:userId',authCheck,getCommentsFromPost)
router.get('/posts/:id/likes/:startIndex/:stopIndex/as/:userId',authCheck,getLikesFromPost)
router.post('/posts/:id/comment',authCheck,commentPost)
// router.post('/posts/:id/edit',authCheck,editPost)
router.post('/comments/:id/like',authCheck,likeComment)
router.get('/comments/:id/likes/:startIndex/:stopIndex/as/:userId',authCheck,getLikesFromComment)
router.get('/comments/:id/subcomments/:startIndex/:stopIndex/as/:userId',authCheck,getCommentsFromComment)
router.post('/posts/:id/like',authCheck,likePost)

//users
router.get('/user/suggested/:userId',authCheck,getSuggestedUsers)
router.post('/user/send/avatar',authCheck,upload.single('image'),sendAvatar)
// router.post('/user/save-post/:id',authCheck,userSavePost)
// router.post('/user/follow/:username',authCheck,userFollowUserPost)
// router.post('/user/unfollow/:username',authCheck,userUnfollowUserPost)

module.exports = router;
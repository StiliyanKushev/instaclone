const router = require('express').Router();
const authCheck = require('../config/auth-check');
const {createPost} = require('../handlers/posts');
const {sendAvatar} = require('../handlers/user');
const multer = require('multer'); 
const User = require('../models/User');
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

//posts
// router.get('/posts/get/user/recent/:index',authCeck,getRecentFromUserPost)
// router.get('/posts/get/user/popular/:index',authCeck,getPopularFromUserPost)
// router.get('/posts/get/all/popular/:index',authCeck,getPopularFromAllPost)
// router.get('/posts/:id/get',authCeck,getPost)
router.post('/posts/create',authCheck,upload.single('image'),createPost)
// router.delete('/posts/:id/delete',authCeck,deletePost)
// router.put('/posts/:id/comment',authCeck,commentPost)
// router.put('/posts/:id/edit',authCeck,editPost)
// router.put('/posts/:id/like',authCeck,likePost)

//users
router.post('/user/send/avatar',authCheck,upload.single('image'),sendAvatar)
// router.put('/user/save-post/:id',authCeck,userSavePost)
// router.put('/user/follow/:username',authCeck,userFollowUserPost)
// router.put('/user/unfollow/:username',authCeck,userUnfollowUserPost)

module.exports = router;
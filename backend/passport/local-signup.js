const PassportLocalStrategy = require('passport-local').Strategy
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const encryption = require('../utilities/encryption')
const fs = require('fs');
const path = require('path');

module.exports = new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, email, password, done) => {
  const user = {
    email: email.trim().toLowerCase(),
    password: password.trim(),
    username: req.body.username.trim()
  }

  User
    .find({$or:[{email: email},{username:req.body.username}]})
    .then(users => {
      if (users.length > 0) {
        return done('user with this e-mail or username already exists!')
      }

      user.salt = encryption.generateSalt()
      user.password = encryption.generateHashedPassword(user.salt, user.password)
      user.roles = []
      user.postsCount = 0;
      user.followersCount = 0;
      user.followingCount = 0;
      user.avatarImg = {
        data: fs.readFileSync( path.dirname(require.main.filename || process.mainModule.filename) + '/uploads/avatar.jpg'),
        contentType: 'image/jpeg',
      };

      User
        .create(user)
        .then((usr) => {
          const token = jwt.sign(usr.id,'s0m3 r4nd0m str1ng')
          let userData = { }
    
          userData.username = user.username;
          userData.email = email.toLowerCase().trim();
          userData.userId = user.id;

          if (user.roles) {
            userData.roles = user.roles
          }

          return done(null, token, userData)
        })
        .catch((error) => {
          console.log(error);
          return done(null);
        })
    })
})

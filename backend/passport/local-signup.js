const PassportLocalStrategy = require('passport-local').Strategy
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const encryption = require('../utilities/encryption')

module.exports = new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, email, password, done) => {
  const user = {
    email: email.trim(),
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
      user.soldItems = [];
      user.inventory = [];

      User
        .create(user)
        .then(() => {
          const payload = {
            sub: user.id
          }
          const token = jwt.sign(payload, 's0m3 r4nd0m str1ng')
          const data = {
            username: user.username
          }
    
          if (user.roles) {
            data.roles = user.roles
          }
          return done(null, token, data)
        })
        .catch((error) => {
          return done(null);
        })
    })
})

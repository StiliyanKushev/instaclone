const jwt = require('jsonwebtoken')
const PassportLocalStrategy = require('passport-local').Strategy
const User = require('../models/User')

module.exports = new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, email, password, done) => {
  const userToLogin = {
    email: email.trim().toLowerCase(),
    password: password.trim()
  }

  User
    .findOne({email: userToLogin.email})
    .then(user => {
      if (!user || !user.authenticate(userToLogin.password)) {
        return done('Incorrect email or password')
      }

      const token = jwt.sign(user.id,'s0m3 r4nd0m str1ng')

      const data = {
        username: user.username,
        email:userToLogin.email.toLowerCase().trim()
      }

      if (user.roles) {
        data.roles = user.roles
      }

      return done(null, token, data)
    })
})

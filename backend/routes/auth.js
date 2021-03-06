const express = require('express')
const encryption = require('../utilities/encryption')
const passport = require('passport')
const validator = require('validator')
const User = require('../models/User')
const authCheck = require('../config/auth-check');

const router = new express.Router()

function validateEditProfile(payload){
  const errors = {}
  let isFormValid = true
  let messege = ''

  if (!payload || typeof payload.username !== 'string' || payload.username.trim().length < 5 || payload.username.trim().length > 20) {
    isFormValid = false
    errors.username = 'Username must be between 5 and 20 chars long.'
  }

  if (!payload || typeof payload.authEmail !== 'string' || !validator.isEmail(payload.authEmail)) {
    isFormValid = false
    errors.authEmail = 'Please provide a correct email address for authentication'
  }

  if (!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email)) {
    isFormValid = false
    errors.email = 'Please provide a correct email address'
  }

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length < 8) {
    isFormValid = false
    errors.password = 'Password must be at least 8 characters long'
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

function validateChangePasswordForm(payload) {
  const errors = {}
  let isFormValid = true
  let messege = ''

  if (!payload || typeof payload.currentPassword !== 'string' || payload.currentPassword.trim().length < 8) {
    isFormValid = false
    errors.password = 'Current password must be at least 8 characters long'
  }

  if (!payload || typeof payload.newPassword !== 'string' || payload.newPassword.trim().length < 8) {
    isFormValid = false
    errors.password = 'New password must be at least 8 characters long'
  }

  if (!payload || typeof payload.repeatNewPassword !== 'string' || payload.repeatNewPassword.trim() !== payload.newPassword.trim()) {
    isFormValid = false
    errors.password = 'Passwords don\'t match'
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

function validateSignupForm(payload) {
  const errors = {}
  let isFormValid = true
  let messege = ''

  if (!payload || typeof payload.username !== 'string' || payload.username.trim().length < 5 || payload.username.trim().length > 20) {
    isFormValid = false
    errors.username = 'Username must be between 5 and 20 chars long.'
  }

  if (!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email)) {
    isFormValid = false
    errors.email = 'Please provide a correct email address'
  }

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length < 8) {
    isFormValid = false
    errors.password = 'Password must be at least 8 characters long'
  }

  if (!payload || typeof payload.r_password !== 'string' || payload.r_password.trim() !== payload.password.trim()) {
    isFormValid = false
    errors.password = 'Passwords don\'t match'
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

function validateLoginForm(payload) {
  const errors = {}
  let isFormValid = true
  let messege = ''

  if (!payload || typeof payload.email !== 'string' || payload.email.trim().length === 0 || !validator.isEmail(payload.email)) {
    isFormValid = false
    errors.email = 'Please provide your email address.'
  }

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
    isFormValid = false
    errors.password = 'Please provide your password.'
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

router.post('/register', (req, res, next) => {
  const validationResult = validateSignupForm(req.body)
  if (!validationResult.success) {
    return res.status(200).json({
      success: false,
      messege: validationResult.messege,
      errors: validationResult.errors
    })
  }

  return passport.authenticate('local-signup', (err, token, userData) => {
    if (err) {
      return res.status(200).json({
        success: false,
        messege: err
      })
    }

    return res.status(200).json({
      success: true,
      messege: 'You have successfully signed up!',
      token: token,
      user: userData
    })
  })(req, res, next)
})

router.post('/login', (req, res, next) => {
  const validationResult = validateLoginForm(req.body)
  if (!validationResult.success) {
    return res.status(200).json({
      success: false,
      messege: validationResult.messege,
      errors: validationResult.errors
    })
  }

  return passport.authenticate('local-login', (err, token, userData) => {
    if (err) {
      return res.status(200).json({
        success: false,
        messege: err
      })
    }

    return res.status(200).json({
      success: true,
      messege: 'You have successfully logged in!',
      token,
      user: userData
    })
  })(req, res, next)

  
})

router.post('/password-change', (req, res, next) => {
  const validationResult = validateChangePasswordForm(req.body)
  if (!validationResult.success) {
    return res.status(200).json({
      success: false,
      messege: validationResult.messege,
      errors: validationResult.errors
    })
  }

  User
    .find({
      email: req.body.email
    })
    .then(users => {
        if (users.length < 0) {
            return res.status(200).json({
              success: false,
              messege: 'No user with this email was found'
            });
        }

        passport.authenticate('local-login', (err, token, userData) => {
          if (err) {
            return res.status(200).json({
              success: false,
              messege: 'Current password is not correct.'
            })
          }
      
          let salt = encryption.generateSalt()
          let password = encryption.generateHashedPassword(salt, req.body.newPassword)
      
          User.updateOne({email:req.body.email},{salt,password},() => {
            res.status(200).json({
              success: true,
              messege: 'New password has been set.'
            })
          });
      
        })({body:{email:req.body.email,password:req.body.currentPassword}}, res, next)
    });
})

router.post('/edit-profile', authCheck, (req, res, next) => {
  const validationResult = validateEditProfile(req.body)
  if (!validationResult.success) {
    return res.status(200).json({
      success: false,
      messege: validationResult.messege,
      errors: validationResult.errors
    })
  }

  User.findOne({email:req.body.authEmail}).then(user => {
    if(!user){
      return res.status(200).json({
        success: false,
        messege: 'No user with the authentication email exists.',
      })
    }
    else{
      passport.authenticate('local-login', (err, token, userData) => {
        if (err) {
          return res.status(200).json({
            success: false,
            messege: 'Email or password is not correct.'
          })
        }
    
        User.updateOne({email:req.body.authEmail},{email:req.body.email,username:req.body.username},() => {
          res.status(200).json({
            success: true,
            messege: 'New email and/or username has been set.',
            user:{
              email:req.body.email,
              username:req.body.username
            }
          })
        });
    
      })({body:{email:req.body.authEmail,password:req.body.password}}, res, next)
    }
  });
})

module.exports = router;
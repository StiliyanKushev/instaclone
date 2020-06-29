const express = require('express')
const passport = require('passport')
const validator = require('validator')

const router = new express.Router()

function validateSignupForm (payload) {
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

function validateLoginForm (payload) {
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

  return passport.authenticate('local-signup', (err,token,userData) => {
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

module.exports = router

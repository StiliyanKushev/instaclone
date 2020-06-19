const jwt = require('jsonwebtoken')
const User = require('../models/User')

module.exports = (req, res, next) => {
  if (!req.headers.token) {
    return res.status(401).end()
  }

  // get the last part from a authorization header string like "bearer token-value"
  const token = req.headers.token;

  // decode the token using a secret key-phrase
  return jwt.verify(token, 's0m3 r4nd0m str1ng', (err, decoded) => {
    if (err) {
      return res.status(401).end()
    }

    const userId = decoded.sub
    User
      .findById(userId)
      .then(user => {
        if (!user) {
          return res.status(401).end()
        }

        req.user = user

        return next()
      })
  })
}

const mongoose = require('mongoose')
const encryption = require('../utilities/encryption')
const fs = require('fs')
const path = require('path');

const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let userSchema = new mongoose.Schema({
  avatarImg: { data: Buffer, contentType: String},
  email: { type: String, required: REQUIRED_VALIDATION_MESSAGE, unique: true },
  username: { type: String, required: REQUIRED_VALIDATION_MESSAGE, unique: true },
  salt: String,
  password: String,
  postsCount:Number,
  followersCount:Number,
  followingCount:Number,
  posts:[{type:mongoose.Schema.Types.ObjectId,ref:'Post'}],
})

userSchema.method({
  authenticate: function (password) {
    return encryption.generateHashedPassword(this.salt, password) === this.password
  }
})

let User = mongoose.model('User', userSchema)

module.exports = User
module.exports.seedAdminUser = () => {
  User.find({email: 'admin@admin.com'}).then(users => {
    if (users.length > 0) return

    let salt = encryption.generateSalt()
    let password = encryption.generateHashedPassword(salt, '12345678')

    User.create({
      email: 'admin@admin.com',
      username: 'Admin',
      salt: salt,
      password: password,
      postsCount: 0,
      followersCount: 0,
      followingCount: 0,
      avatarImg: {
        data: fs.readFileSync( path.dirname(require.main.filename || process.mainModule.filename) + '/uploads/avatar.jpg'),
        contentType: 'image/jpeg',
      }
    })
  })
}
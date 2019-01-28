const mongoose = require('mongoose')
const crypto = require('crypto')
const { jwtGen } = require('../utils')

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      index: true,
      sparse: true,
      unique: true
    },
    method: String,
    hash: String,
    salt: String,
    role: String
  }
)

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex')
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
}

UserSchema.methods.validatePassword = function (password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
  return this.hash === hash
}

UserSchema.methods.generateJWT = function () {
  return jwtGen({
    email: this.email,
    id: this._id,
    role: this.role
  })
}

UserSchema.methods.toAuthJSON = function () {
  return {
    _id: this._id,
    email: this.email,
    token: this.generateJWT()
  }
}

const UserRepository = mongoose.model('users', UserSchema)
module.exports = UserRepository

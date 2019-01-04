const mongoose = require('mongoose')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')

const UserSchema = new mongoose.Schema(userModel)

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex')
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
}

UserSchema.methods.validatePassword = function (password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
  return this.hash === hash
}

UserSchema.methods.generateJWT = function () {
  const today = new Date()
  const expirationDate = new Date(today)
  expirationDate.setDate(today.getDate() + 60)

  return jwt.sign({
    email: this.email,
    id: this._id,
    role: this.role,
    exp: parseInt(expirationDate.getTime() / 1000, 10)
  }, process.env.SESSION_SECRET)
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

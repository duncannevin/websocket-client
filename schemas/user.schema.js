const mongoose = require('mongoose')
const bCrypt = require('bCrypt')
const uniqId = require('uniqid')
const util = require('util')
const {userIdPrefix} = require('../utils/names.utils')
const userModel = require('../models/user.model')
const UserSchema = new mongoose.Schema(userModel)

UserSchema.pre('save', function save(next) {
  const user = this
  if (!user.isModified('password')) {
    return next()
  }
  bCrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err)
    }
    bCrypt.hash(user.password, salt, __, (err, hash) => {
      if (err) {
        return next(err)
      }
      user.password = hash
      next()
    })
  })
})

UserSchema.pre('save', function (next) {
  const user = this
  if (!user.hasOwnProperty('user_id')) {
    user.user_id = uniqId(userIdPrefix + '-')
  }
  next()
})

UserSchema.methods.comparePassword = function (candidatePassword) {
  const qCompare = util.promisify(bCrypt.compare)
  return qCompare(candidatePassword, this.password)
}

const UserRepository = mongoose.model('UserMdl', UserSchema)
module.exports = UserRepository

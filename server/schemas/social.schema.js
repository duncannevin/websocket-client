const mongoose = require('mongoose')
const { jwtGen } = require('../utils')

const SocialSchema = new mongoose.Schema(
  {
    username: String,
    email: String,
    role: String,
    socialId: {
      type: String,
      trim: true,
      index: true,
      sparse: true,
      unique: true
    }
  }
)

SocialSchema.methods.generateJWT = function () {
  return jwtGen({
    username: this.username,
    email: this.email,
    id: this._id,
    role: this.role,
    socialId: this.socialId
  })
}

SocialSchema.methods.toAuthJSON = function () {
  return {
    _id: this._id,
    username: this.username,
    email: this.email,
    socialId: this.socialId,
    token: this.generateJWT()
  }
}

const SocialUserRepository = mongoose.model('social', SocialSchema)
module.exports = SocialUserRepository

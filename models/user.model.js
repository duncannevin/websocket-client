module.exports = {
  email: {
    type: String,
    unique: true
  },
  auth_method: String,
  hash: String,
  salt: String,
  role: String
}

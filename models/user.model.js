module.exports = {
  email: {
    type: String,
    trim: true,
    index: true,
    sparse: true
  },
  method: String,
  hash: String,
  salt: String,
  role: String
}

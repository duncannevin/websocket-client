module.exports = {
  user_id: {
    type: String,
    unique: true
  },
  password: String,
  role: String,
  email: {
    type: String,
    unique: true
  },
  username: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  display_name: String,
}

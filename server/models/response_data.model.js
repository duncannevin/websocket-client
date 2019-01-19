module.exports = {
  userId: String,
  connectionName: {
    type: String,
    unique: true
  },
  responses: [{
    bodyName: String,
    lang: String,
    content: String
  }]
}

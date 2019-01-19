module.exports = {
  userId: String,
  connected: Boolean,
  url: String,
  connectionName: {
    type: String,
    unique: String
  }
}

/*
urlData: {
  connected: false,
    url: 'ws://localhost:9000/ws'
}
*/

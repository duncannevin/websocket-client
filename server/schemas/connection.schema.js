const mongoose = require('mongoose')

const Body = {
  name: String,
  lang: String,
  content: String
}

const Header = {
  key: String,
  value: String
}

const Response = {
  bodyName: String,
  lang: String,
  contents: [{
    lang: String,
    wsSent: Body,
    wsResponse: String
  }]
}

const ConnectionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },
    name: {
      type: String,
      unique: true,
      required: true
    },
    url: {
      default: 'ws://echo.websocket.org',
      type: String
    },
    cookies: {
      type: [Body],
      default: []
    },
    headers: {
      type: [Header],
      default: []
    },
    bodies: {
      type: [Body],
      default: []
    },
    responses: {
      type: [Response],
      default: []
    }
  }
)

const ConnectionRepository = mongoose.model('connection', ConnectionSchema)
module.exports = ConnectionRepository

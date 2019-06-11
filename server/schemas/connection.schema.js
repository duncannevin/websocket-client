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
  contents: [{
    lang: String,
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
      required: true
    },
    url: {
      default: 'ws://echo.websocket.org',
      type: String
    },
    cookies: {
      type: [Header],
      default: []
    },
    body: {
      type: Body,
      default: {
        name: 'untitled',
        lang: 'json',
        content: ''
      }
    },
    responses: {
      type: [Response],
      default: [
        {
          lang: 'json',
          wsResponse: ''
        }
      ]
    }
  }
)

const ConnectionRepository = mongoose.model('connection', ConnectionSchema)
module.exports = ConnectionRepository

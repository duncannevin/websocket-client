const mongoose = require('mongoose')

const RequestDataModel = new mongoose.Schema(
  {
    userId: String,
    connectionName: {
      type: String,
      unique: true
    },
    cookies: [{
      key: String,
      value: String
    }],
    headers: [{
      key: String,
      value: String
    }],
    bodies: [{
      name: String,
      lang: String,
      content: String
    }]
  }
)

const RequestDataRepository = mongoose.model('request_data', RequestDataModel)
module.exports = RequestDataRepository

const mongoose = require('mongoose')

const UrlDataModel = new mongoose.Schema(
  {
    userId: String,
    connected: Boolean,
    url: String,
    connectionName: {
      type: String,
      unique: String
    }
  }
)

const UrlDataRepository = mongoose.model('url_data', UrlDataModel)
module.exports = UrlDataRepository

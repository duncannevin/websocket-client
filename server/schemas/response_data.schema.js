const mongoose = require('mongoose')

const ResponseDataModel = new mongoose.Schema(
  {
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
)

const ResponseDataRepository = mongoose.model('response_data', ResponseDataModel)
module.exports = ResponseDataRepository

const mongoose = require('mongoose')
const responseDataModel = require('../models/response_data.model')

const ResponseDataModel = new mongoose.Schema(responseDataModel)

const ResponseDataRepository = mongoose.model('response_data', ResponseDataModel)
module.exports = ResponseDataRepository

const mongoose = require('mongoose')
const requestDataModel = require('../models/request_data.model')

const RequestDataModel = new mongoose.Schema(requestDataModel)

const RequestDataRepository = mongoose.model('request_data', RequestDataModel)
module.exports = RequestDataRepository

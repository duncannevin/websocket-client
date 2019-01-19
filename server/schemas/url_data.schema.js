const mongoose = require('mongoose')
const urlDataModel = require('../models/url_data.model')

const UrlDataModel = new mongoose.Schema(urlDataModel)

const UrlDataRepository = mongoose.model('url_data', UrlDataModel)
module.exports = UrlDataRepository

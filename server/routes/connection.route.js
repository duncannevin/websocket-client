const {Router} = require('express')
const connectionRouter = Router()
const {optional, required} = require('./auth')
const connectionControl = require('../controllers/connection.control')

connectionRouter.get('/create_connection', optional, connectionControl.createConnection)

module.exports = connectionRouter

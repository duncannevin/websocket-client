const {Router} = require('express')
const connectionRouter = Router()
const {optional, required} = require('./auth')
const connectionControl = require('../controllers/connection.control')

connectionRouter.post('/create_connection', optional, connectionControl.createConnection)
connectionRouter.post('/create_body', optional, connectionControl.createWsBody)

module.exports = connectionRouter

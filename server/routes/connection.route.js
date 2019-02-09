const {Router} = require('express')
const connectionRouter = Router()
const {optional, required} = require('./auth')
const connectionControl = require('../controllers/connection.control')

connectionRouter.post('/create_connection', optional, connectionControl.createConnection)
connectionRouter.post('/create_body', optional, connectionControl.createWsBody)
connectionRouter.post('/create_cookie', optional, connectionControl.saveCookie)

connectionRouter.put('/update_response', optional, connectionControl.updateResponseContents)
connectionRouter.put('/remove_cookie', optional, connectionControl.removeCookie)

module.exports = connectionRouter

const {Router} = require('express')
const connectionRouter = Router()
const {optional, required} = require('./auth')
const connectionControl = require('../controllers/connection.control')

connectionRouter.post('/create_connection', optional, connectionControl.createConnection)
connectionRouter.post('/create_cookie', optional, connectionControl.saveCookie)
connectionRouter.post('/save_connections', required, connectionControl.saveConnections)

connectionRouter.put('/update_response', optional, connectionControl.updateResponseContents)
connectionRouter.put('/remove_cookie', optional, connectionControl.removeCookie)
connectionRouter.put('/remove_response', optional, connectionControl.removeResponse)
connectionRouter.put('/update_body', optional, connectionControl.updateBody)

connectionRouter.get('/get_connections', required, connectionControl.getConnections)
connectionRouter.get('/get_connection/:connectionId', required, connectionControl.getConnection)

connectionRouter.delete('/remove_connection/:connectionId', optional, connectionControl.removeConnection)

module.exports = connectionRouter

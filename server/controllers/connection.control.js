const { connectionDAO } = require('../daos')
const { getLogger } = require('log4js')
const connectionLogger = getLogger('connection')
const uId = require('uniqid')

class ConnectionControl {
  async createConnection (req, res, next) {
    try {
      const { name, url } = req.body
      let connection
      if (req.hasOwnProperty('payload')) {
        const { id } = req.payload
        connection = await connectionDAO.saveConnection({ userId: id, name, url })
      } else {
        connection = connectionDAO.getUnauthorizedConnection({ name, url })
      }
      res.status(201).send(connection)
    } catch (error) {
      connectionLogger.debug('[createConnection]', error)
      res.status(400).send({ msg: error.message, code: 400 })
    }
  }

  async createWsBody (req, res, next) {
    try {
      const { connectionId, name } = req.body
      let wsBody = Object.assign({ name }, { content: '', lang: 'json' })
      let wsResponse = { bodyName: name, contents: [] }
      if (req.hasOwnProperty('payload')) {
        wsBody = await connectionDAO.saveBody({ connectionId, wsBody })
        await connectionDAO.saveResponse({ connectionId, wsResponse })
      } else {
        wsBody._id = uId(24)
      }
      wsResponse.bodyId = wsBody._id
      res.status(201).send({ wsBody, wsResponse })
    } catch (error) {
      connectionLogger.debug('[createBody]', error)
      res.status(400).send({ msg: error.message, code: 400 })
    }
  }
}

module.exports = new ConnectionControl()

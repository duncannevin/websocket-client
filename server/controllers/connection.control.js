const {connectionDAO} = require('../daos')
const {getLogger} = require('log4js')
const connectionLogger = getLogger('connection')

class ConnectionControl {
  async createConnection (req, res, next) {
    try {
      const {name, url} = req.body
      let connection
      if (req.hasOwnProperty('payload')) {
        const {_id} = req.payload
        connection = await connectionDAO.save({userId: id, name, url})
      } else {
        connection = connectionDAO.getUnauthorizedConnection({name, url})
      }
      res.status(201).send(connection)
    } catch (error) {
      connectionLogger.debug('[createConnection]', error)
      res.status(400).send({msg: error.message, code: 400})
    }
  }

  async createBody (req, res, next) {
    try {
      const {connectionId, name} = req.body
      let body
      if (req.hasOwnProperty('payload')) {
        const {_id} = req.payload
        body = '???'
      } else {
        body = '???'
      }
      res.status(201).send(body)
    } catch (error) {
      connectionLogger.debug('[createBody]', error)
      res.status(400).send({msg: error.message, code: 400})
    }
  }
}

module.exports = new ConnectionControl()

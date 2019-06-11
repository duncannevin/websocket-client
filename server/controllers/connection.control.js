const { connectionDAO } = require('../daos')
const { getLogger } = require('log4js')
const connectionLogger = getLogger('connection')
const { Types, ObjectId } = require('mongoose')

class ConnectionControl {
  async saveConnections (req, res, next) {
    try {
      const { id } = req.payload
      const { connections } = req.body
      const preparedConnections = await Promise.all(connections.map(async (connection) => {
        connection.userId = id
        connection.responses = connection.responses.map((response) => {
          response._id = Types.ObjectId(response._id)
          return response
        })
        connection._id = Types.ObjectId(connection._id)
        return await connectionDAO.saveConnection(id, connection)
      }))
      res.status(201).send({ connections: preparedConnections })
    } catch (error) {
      res.status(400).send({ msg: error.message, code: 400 })
    }
  }

  async removeConnection (req, res, next) {
    try {
      const { connectionId } = req.params
      if (req.hasOwnProperty('payload')) {
        await connectionDAO.deleteConnection({ connectionId })
      }
      res.status(201).send()
    } catch (error) {
      res.status(400).send({ msg: error.message, code: 400 })
    }
  }

  async getConnections (req, res, next) {
    try {
      const { id } = req.payload
      const connections = await connectionDAO.getConnections({ userId: id })
      res.status(200).send({ connections })
    } catch (error) {
      res.status(400).send({ msg: error.message, code: 400 })
    }
  }

  async getConnection (req, res, next) {
    try {
      const { connectionId } = req.params
      const connection = await connectionDAO.getConnection({ connectionId })
      res.send({ connection })
    } catch (error) {
      res.status(400).send({ msg: error.message, code: 400 })
    }
  }

  async createConnection (req, res, next) {
    try {
      const { name, url } = req.body
      let connection
      if (req.hasOwnProperty('payload')) {
        const { id } = req.payload
        connection = await connectionDAO.saveConnection(id, { name, url })
      } else {
        connection = connectionDAO.getUnauthorizedConnection({ name, url })
      }
      res.status(201).send(connection)
    } catch (error) {
      connectionLogger.debug('[createConnection]', error)
      res.status(400).send({ msg: error.message, code: 400 })
    }
  }

  async updateBody (req, res, next) {
    try {
      const { _id, content, lang } = req.body
      if (req.hasOwnProperty('payload')) {
        await connectionDAO.updateBody({ _id, content, lang })
      }  
      res.status(201).send({ updatedContent: content, updatedLang: lang })
    } catch (error) {
      connectionLogger.debug('[createConnection]', error)
      res.status(400).send({ msg: error.message, code: 400 })
    }
  }

  async updateResponseContents (req, res, next) {
    try {
      const { connectionId, responseId, wsResponse } = req.body
      let newResponse
      if (req.hasOwnProperty('payload')) {
        newResponse = await connectionDAO.updateResponseContents({ connectionId, responseId, wsResponse })
      } else {
        newResponse = Object.assign(wsResponse, { _id: Types.ObjectId() })
      }
      res.status(201).send({ wsResponse: newResponse })
    } catch (error) {
      connectionLogger.debug('[updateResponseContents]', error)
      res.status(400).send({ msg: error.message, code: 400 })
    }
  }

  async saveCookie (req, res, next) {
    try {
      const { connectionId, key, value } = req.body
      if (req.hasOwnProperty('payload')) {
        await connectionDAO.saveCookie({ connectionId, key, value })
      }
      res.status(201).cookie(key, value).send({ key, value })
    } catch (error) {
      res.status(400).send({ msg: error.message, code: 400 })
    }
  }

  async removeCookie (req, res, next) {
    try {
      const { connectionId, key } = req.body
      if (req.hasOwnProperty('payload')) {
        await connectionDAO.deleteCookie({ connectionId, key })
      }
      res.status(200).clearCookie(key).send()
    } catch (error) {
      res.status(400).send({ msg: error.message, code: 400 })
    }
  }

  async removeResponse (req, res, next) {
    try {
      const { connectionId, responseId, contentId } = req.body
      if (req.hasOwnProperty('payload')) {
        await connectionDAO.deleteResponse({ connectionId, responseId, contentId })
      }
      res.status(200).send()
    } catch (error) {
      res.status(400).send({ msg: error.message, code: 400 })
    }
  }
}

module.exports = new ConnectionControl()

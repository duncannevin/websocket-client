const {connectionDAO} = require('../daos')

class ConnectionControl {
  async createConnection (req, res, next) {
    try {
      const {name} = req.body
      let connection
      if (req.hasOwnProperty('payload')) {
        const {id} = req.payload
        connection = await connectionDAO.save({userId: id, name})
      } else {
        connection = connectionDAO.getUnauthorizedConnection(name)
      }
      res.status(201).send(connection)
    } catch (error) {
      res.status(400).send({msg: error.message, code: 400})
    }
  }
}

module.exports = new ConnectionControl()

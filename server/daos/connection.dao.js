const {ConnectionRepository} = require('../schemas')

class ConnectionDAO {
  getUnauthorizedConnection (name) {
    return new ConnectionRepository({userId: 'un-authorized-user', name: name})
  }

  async save ({userId, name}) {
    const connection = new ConnectionRepository({userId, name})
    await connection.save()
    return connection
  }
}

module.exports = new ConnectionDAO()

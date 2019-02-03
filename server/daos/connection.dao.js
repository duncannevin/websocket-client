const {ConnectionRepository} = require('../schemas')

class ConnectionDAO {
  getUnauthorizedConnection ({name, url}) {
    return new ConnectionRepository({userId: 'un-authorized-user', name: name, url: url})
  }

  async save ({userId, name, url}) {
    const connection = new ConnectionRepository({userId, name, url})
    await connection.save()
    return connection
  }
}

module.exports = new ConnectionDAO()

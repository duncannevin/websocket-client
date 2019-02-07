const {ConnectionRepository} = require('../schemas')

class ConnectionDAO {
  /**
   * @param name
   * @param url
   * @return {*}
   */
  getUnauthorizedConnection ({name, url}) {
    return new ConnectionRepository({userId: 'un-authorized-user', name: name, url: url})
  }

  /**
   * @param userId
   * @param name
   * @param url
   * @return {Promise<*>}
   */
  async saveConnection ({userId, name, url}) {
    const connection = new ConnectionRepository({userId, name, url})
    await connection.save()
    return connection
  }

  /**
   * @param connectionId
   * @param wsbody
   * @return {Promise<*>}
   */
  async saveBody ({connectionId, wsBody}) {
    const updated = await ConnectionRepository.findOneAndUpdate(
      {_id: connectionId},
      {$push: {bodies: wsBody}}
    )
    return updated.bodies[updated.bodies.length - 1]
  }
}

module.exports = new ConnectionDAO()

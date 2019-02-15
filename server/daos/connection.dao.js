const { ConnectionRepository } = require('../schemas')

class ConnectionDAO {
  /**
   * @param name
   * @param url
   * @return {*}
   */
  getUnauthorizedConnection ({ name, url }) {
    return new ConnectionRepository({ userId: 'un-authorized-user', name: name, url: url })
  }

  /**
   * @param userId
   * @param name
   * @param url
   * @return {Promise<*>}
   */
  async saveConnection ({ userId, name, url }) {
    const connection = new ConnectionRepository({ userId, name, url })
    await connection.save()
    return connection
  }

  /**
   * @param connectionId
   * @param wsbody
   * @return {Promise<*>}
   */
  async saveBody ({ connectionId, wsBody }) {
    const updated = await ConnectionRepository.findOneAndUpdate(
      { _id: connectionId },
      { $push: { bodies: wsBody } },
      { new: true }
    )
    return updated.bodies[updated.bodies.length - 1]
  }

  /**
   * @param connectionId
   * @param wsResponse
   * @return {Promise<*>}
   */
  async saveResponse ({ connectionId, wsResponse }) {
    const updated = await ConnectionRepository.findOneAndUpdate(
      { _id: connectionId },
      { $push: { responses: wsResponse } },
      { new: true }
    )
    return updated.responses[updated.responses.length - 1]
  }

  /**
   * @param connectionId
   * @param _id
   * @param wsResponse
   * @return {Promise<void>}
   */
  async updateResponseContents ({ connectionId, responseId, wsResponse }) {
    return await ConnectionRepository.updateOne(
      { _id: connectionId, 'responses._id': responseId },
      { $push: { 'responses.$.contents': wsResponse } }
    )
  }

  async saveCookie ({ connectionId, key, value }) {
    return await ConnectionRepository.updateOne(
      { _id: connectionId },
      { $push: { cookies: { key, value } } }
    )
  }

  async deleteCookie ({ connectionId, key }) {
    const updated = await ConnectionRepository.findOneAndUpdate(
      { _id: connectionId },
      { $pull: { cookies: { key } } },
      { multi: true, new: true }
    )
    return updated.cookies
  }

  async deleteBody ({ connectionId, bodyId }) {
    const updated = await ConnectionRepository.findOneAndUpdate(
      { _id: connectionId },
      {
        $pull: {
          bodies: { _id: bodyId },
          responses: { bodyId }
        }
      },
      { multi: true, new: true }
    )
    return updated.bodies
  }
}

module.exports = new ConnectionDAO()

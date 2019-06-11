const { ConnectionRepository } = require('../schemas')

class ConnectionDAO {
  async deleteConnection ({ connectionId }) {
    return await ConnectionRepository.deleteOne({ _id: connectionId })
  }

  async getConnections ({ userId }) {
    return await ConnectionRepository.find({ userId })
  }

  async getConnection ({ connectionId }) {
    return await ConnectionRepository.find({ _id: connectionId })
  }

  /**
   * @param name
   * @param url
   * @return {*}
   */
  getUnauthorizedConnection ({ name, url }) {
    return new ConnectionRepository({ userId: 'un-authorized-user', name: name, url: url })
  }

  /**
   * @param userId {String}
   * @param connectionData {object}
   * @return {Promise<*>}
   */
  async saveConnection (userId, connectionData) {
    const connection = new ConnectionRepository(Object.assign({userId}, connectionData))
    await connection.save()
    return connection
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
    const updated = await ConnectionRepository.findOneAndUpdate(
      { _id: connectionId, 'responses._id': responseId },
      { $push: { 'responses.$.contents': wsResponse } },
      { new: true }
    )
    return updated.responses.find((res) => res._id.toString() === responseId).contents.slice(-1).pop()
  }

  async updateBody ({ _id, content, lang }) {
    const updated = await ConnectionRepository.findOneAndUpdate(
      { _id },
      { 'body.content': content, 'body.lang': lang},
      { new: true }
    )
    return updated
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

  async deleteResponse ({ connectionId, responseId, contentId }) {
    return await ConnectionRepository.findOne(
      { _id: connectionId }
    )
      .then((connection) => {
        connection.responses = connection.responses.map((res) => {
          if (res._id.toString() === responseId) {
            res.contents = res.contents.filter((cont) => cont === null || (cont._id.toString() !== contentId))
          }
          return res
        })
        connection.save()
      })
  }
}

module.exports = new ConnectionDAO()

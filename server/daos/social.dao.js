const {SocialRepository} = require('../schemas')

class SocialDAO {
  /**
   * @description Fetches single user from the storage by _id
   * @param id
   * @returns {Promise<user.model>}
   */
  async find(id) {
    const user = await SocialRepository.findOne({_id: id})
    return user.toAuthJSON()
  }

  async findBySocialId(id) {
    return await SocialRepository.findOne({ socialId: id })
  }

  /**
   * @description Saves the user in the storage
   * @param user
   * @returns {Promise<user>}
   */
  async save(user) {
    try {
      const newUser = new SocialRepository(user)
      await newUser.save()
      return newUser.toAuthJSON()
    } catch (_) {
      const existingUser = await this.findBySocialId(user.socialId)
      return existingUser.toAuthJSON()
    }
  }

  /**
   * @description Fetches all users from the storage
   * @returns {Promise<user.model[]>}
   */
  async findAll() {
    return await SocialRepository.find()
  }

  /**
   * @description deletes a single user record from storage
   * @return {Promise<>}
   * @param email
   */
  async deleteOne(email) {
    return await SocialRepository.deleteOne({email: email})
  }
}

module.exports = new SocialDAO()

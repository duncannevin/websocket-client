const { UserRepository } = require('../schemas')

class UserDAO {
  /**
   * @description Fetches single user from the storage by email
   * @param email
   * @returns {Promise<user.model>}
   */
  async findByEmail (email) {
    return await UserRepository.findOne({ email: email })
  }

  async find (id) {
    return await UserRepository.findOne({ _id: id })
  }

  /**
   * @description Saves the user in the storage
   * @param user
   * @returns {Promise<user>}
   */
  async save (user) {
    const newUser = new UserRepository(user)
    newUser.setPassword(user.password)
    await newUser.save()
    return newUser.toAuthJSON()
  }

  /**
   * @description Fetches all users from the storage
   * @returns {Promise<user.model[]>}
   */
  async findAll () {
    return await UserRepository.find()
  }

  /**
   * @description deletes a single user record from storage
   * @return {Promise<>}
   * @param email
   */
  async deleteOne (email) {
    return await UserRepository.deleteOne({ email: email })
  }
}

module.exports = new UserDAO()

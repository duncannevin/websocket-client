const {UserRepository} = require('../schemas')

class UserDAO {
  /**
   * @description Finds user by id
   * @param id
   * @return {Promise<user.model>}
   */
  async findById(id) {
    return await UserRepository.findById(id)
  }

  /**
   * @description Fetches single user from the storage by email
   * @param email
   * @returns {Promise<user.model>}
   */
  async findByEmail(email) {
    return await UserRepository.findOne({email: email})
  }

  async findByUsername(username) {
    return await UserRepository.findOne({username: username})
  }

  /**
   * @description Fetches single user from the storage by email or username
   * @param username
   * @param email
   * @returns {Promise<user.model>}
   */
  async findByUsernameOrEmail(username, email) {
    return await UserRepository.findOne({$or: [{email: email}, {username: username}]})
  }

  /**
   * @description Fetches single user by user_id
   * @param userId
   * @returns {Promise<user.model>}
   */
  async findByUserId(userId) {
    return await UserRepository.findOne({user_id: userId})
  }

  /**
   * @description Saves the user in the storage
   * @param user
   * @returns {Promise<user.model>}
   */
  async save(user) {
    return (await new UserRepository(user).save()).toObject({virtuals: true})
  }

  /**
   * @description Creates or updates a current user (for social auth)
   * @param user
   * @return {Promise<user.model>}
   */
  async updateOrCreate(user) {
    return (await UserRepository.findOneAndUpdate({user_id: user.user_id}, user, {upsert: true, new: true}))
  }

  /**
   * @description Fetches all users from the storage
   * @returns {Promise<user.model[]>}
   */
  async findAll() {
    return await UserRepository.find()
  }

  /**
   * @description deletes a single user record from storage
   * @param username
   * @return {Promise<>}
   */
  async deleteOne(username) {
    return await UserRepository.deleteOne({username: username})
  }
}

module.exports = new UserDAO()

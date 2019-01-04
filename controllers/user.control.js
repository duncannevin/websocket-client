const {userDAO} = require('../daos')

class UserControl {
  async getUsers (req, res) {
    try {
      const users = await userDAO.findAll()
      res.status(200).send({users: users})
    } catch (error) {
      res.status(400).send({msg: error})
    }
  }
}

module.exports = new UserControl()

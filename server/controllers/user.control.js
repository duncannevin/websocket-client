const { userDAO, socialDAO } = require('../daos')
const { roleCheck } = require('../utils/req_validators.util')

class UserControl {
  async getUsers (req, res) {
    const validateRole = roleCheck(req, 'admin')
    if (validateRole) {
      return res.status(401).send(validateRole)
    }
    try {
      const users = await userDAO.findAll()
      res.status(200).send({ users: users })
    } catch (error) {
      res.status(400).send({ msg: error })
    }
  }

  async getSocialUser (req, res) {
    try {
      const user = await socialDAO.find(req.query.userId)
      res.status(200).send({ user })
    } catch (error) {
      res.status(400).send({ msg: error })
    }
  }
}

module.exports = new UserControl()

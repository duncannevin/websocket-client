const {validateLogin} = require('../utils/req_validators.util')
const userDAO = require('../daos/user.dao')
const {getLogger} = require('log4js')
const authLogger = getLogger('auth')
const mongoose = require('mongoose')
const Users = mongoose.model('users')

class AuthControl {
  async register (req, res) {
    const user = req.body
    user.auth_method = 'local'
    const validationErrors = validateLogin(req)
    if (validationErrors) {
      return res.status(422).send({msg: validationErrors, code: 422})
    }
    try {
      const addedUser = await userDAO.save(user)
      res.status(200).send({user: addedUser})
    } catch (error) {
      authLogger.debug(error)
      res.status(400).send({msg: error})
    }
  }

  async login (req, res) {
    const {body: {user}} = req
    const validationErrors = validateLogin(req)
    if (validationErrors) {
      return res.status(401).send({msg: validationErrors, code: 401})
    }
    try {
      const foundUser = await userDAO.updateOrCreate(user.email)
      res.status(200).send({user: foundUser.toAuthJSON()})
    } catch (error) {
      authLogger.debug(error)
      res.status(400).send({msg: error})
    }
  }

  async current (req, res) {
    const {payload: {id}} = req
    try {
      const user = await userDAO.findById(id)
      res.status(200).send({user: user.toAuthJSON()})
    } catch (error) {
      authLogger.debug(error)
      res.status(400).send({msg: error})
    }
  }
}

module.exports = new AuthControl()

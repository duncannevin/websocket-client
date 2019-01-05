const {validateLogin} = require('../utils/req_validators.util')
const userDAO = require('../daos/user.dao')
const {getLogger} = require('log4js')
const authLogger = getLogger('auth')
const passport = require('passport')
const jwt = require('jsonwebtoken')

class AuthControl {
  async register (req, res, next) {
    const user = req.body
    user.method = 'local'
    user.role = 'guest'
    const validationErrors = validateLogin(req)
    if (validationErrors) {
      return res.status(422).send({msg: validationErrors, code: 422})
    }
    try {
      const addedUser = await userDAO.save(user)
      res.status(200).send({user: addedUser})
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).send({msg: 'Email already exists', code: error.code})
      }
      authLogger.debug(error)
      next(error)
    }
  }

  login (req, res, next) {
    const validationErrors = validateLogin(req)
    if (validationErrors) {
      return res.status(422).send({msg: validationErrors, code: 422})
    }
    return passport.authenticate('local', {session: false}, (err, passportUser, info) => {
      if (err) return next(err)
      if (passportUser) {
        passportUser.generateJWT()
        return res.status(200).send({user: passportUser.toAuthJSON()})
      }
    })(req, res, next)
  }

  async handleSocial (req, res, next) {
    if (!req.hasOwnProperty('user')) return res.status(400).send({msg: 'No user field provided'})
    res.status(200).send(req.user)
  }
}

module.exports = new AuthControl()

const {validateLogin} = require('../utils/req_validators.util')
const userDAO = require('../daos/user.dao')
const {getLogger} = require('log4js')
const authLogger = getLogger('auth')
const passport = require('passport')

class AuthControl {
  async register (req, res) {
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
      res.status(400).send({msg: error, code: error.code})
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
}

module.exports = new AuthControl()

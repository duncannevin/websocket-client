const { validateLogin } = require('../utils/req_validators.util')
const { socialDAO, userDAO } = require('../daos')
const { getLogger } = require('log4js')
const authLogger = getLogger('auth')
const passport = require('passport')
const { Types, ObjectId } = require('mongoose')

class AuthControl {
  async emailExists (req, res, next) {
    try {
      const { email } = req.body
      const maybeUser = await userDAO.findByEmail(email)
      res.status(200).send(maybeUser !== null)
    } catch (error) {
      res.status(400).send({ msg: error.message, code: 400 })
    }
  }

  async register (req, res, next) {
    const user = req.body
    user.method = 'local'
    user.role = 'guest'
    const validationErrors = validateLogin(req)
    if (validationErrors) {
      return res.status(422).send({ msg: validationErrors, code: 422 })
    }
    try {
      const addedUser = await userDAO.save(user)
      res.status(201).send({ user: addedUser })
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).send({ msg: 'Email already exists', code: error.code })
      }
      authLogger.debug(error)
      next(error)
    }
  }

  async login (req, res, next) {
    if (req.hasOwnProperty('payload')) {
      try {
        const { id } = req.payload
        const user = await userDAO.find(id)
        res.status(200).send({ user: user.toAuthJSON() })
      } catch (error) {
        res.status(401).send({msg: 'Unauthorized', code: 401})
      }
    } else {
      const validationErrors = validateLogin(req)
      if (validationErrors) {
        return res.status(422).send({ msg: validationErrors, code: 422 })
      }
      return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
        if (err) return next(err)
        if (passportUser) {
          passportUser.generateJWT()
          return res.status(200).send({ user: passportUser.toAuthJSON() })
        }
        return res.status(401).send({ msg: 'Unauthorized', code: 401 })
      })(req, res, next)
    }
  }

  async handleSocial (req, res, next) {
    if (!req.hasOwnProperty('user')) return res.status(400).send({ msg: 'No user field provided', code: 400 })
    res.redirect('/#/socialredirect?userid=' + req.user._id)
  }
}

module.exports = new AuthControl()

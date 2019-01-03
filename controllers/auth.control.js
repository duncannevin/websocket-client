const passport = require('passport')

class AuthControl {
  login () {}
  register () {}
  activate () {}
  emailExistsCheck () {}
  usernameExistsCheck () {}
  socialAuth (strategy, options) {
    return passport.authenticate(strategy, options)
  }
}

module.exports = new AuthControl()

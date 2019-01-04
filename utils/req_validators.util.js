function validateLogin(req) {
  req.checkBody('email', 'Email is not valid').isEmail()
  req.checkBody('password', 'Password cannot be blank').notEmpty()
  req.sanitize('email').normalizeEmail({gmail_remove_dots: false})

  return req.validationErrors()
}

module.exports = {validateLogin}

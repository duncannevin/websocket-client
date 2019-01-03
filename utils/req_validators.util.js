function validateLogin(req) {
  req.checkBody('email', 'Email is not valid').isEmail()
  req.checkBody('password', 'Password cannot be blank').notEmpty()
  req.sanitize('email').normalizeEmail({gmail_remove_dots: false})

  return req.validationErrors()
}

function validateRegister(req) {
  req.checkBody('password', 'Password cannot be blank').notEmpty()
  req.checkBody('fname', 'First name must be specified').notEmpty()
  req.checkBody('lname', 'Last name must be specified').notEmpty()
  req.checkBody('username', 'Username must be specified').notEmpty()
  req.checkBody('role', 'Role must be specified').notEmpty()

  req.assert('email', 'Email is not valid').isEmail()
  req.sanitize('email').normalizeEmail({gmail_remove_dots: false})

  return req.validationErrors()
}

module.exports = {validateLogin, validateRegister}

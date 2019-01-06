function validateLogin(req) {
  req.checkBody('email', 'Email is not valid').isEmail()
  req.checkBody('password', 'Password cannot be blank').notEmpty()
  req.sanitize('email').normalizeEmail({gmail_remove_dots: false})

  return req.validationErrors()
}

function roleCheck(req, allowedRole) {
  const {payload: {role}} = req
  if (role !== allowedRole) return {msg: 'Incorrect credentials'}
  return null
}

module.exports = {validateLogin, roleCheck}

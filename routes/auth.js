const jwt = require('express-jwt')

function _getTokenFromHeaders (req) {
  const {headers: {authorization}} = req

  if (authorization && authorization.split(' ')[0] === 'Token') {
    return authorization.split(' ')[1]
  }

  return null
}

const required = jwt({
  secret: 'secret',
  userProperty: 'payload',
  getToken: _getTokenFromHeaders
})

const optional = jwt({
  secret: 'secret',
  userProperty: 'payload',
  getToken: _getTokenFromHeaders,
  credentialsRequired: false
})

module.exports = {required, optional}

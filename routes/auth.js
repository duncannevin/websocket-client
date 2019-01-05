const jwt = require('express-jwt')

/**
 *
 * @param req
 * @return {*}
 * @private
 */
function _getTokenFromHeaders(req) {
  const {headers: {authorization}} = req
  const name = authorization && authorization.split(' ')[0]
  if (name === 'Token' || name === 'Bearer') {
    return authorization.split(' ')[1]
  }

  return null
}

/**
 * @description secret must come from a cb since it is a env variable
 * @param req
 * @param payload
 * @param done
 * @private
 */
function _getSecret (req, payload, done) {
  const secret = process.env.SESSION_SECRET
  done(null, secret)
}

const required = jwt({
  secret: _getSecret,
  userProperty: 'payload',
  getToken: _getTokenFromHeaders
})

const optional = jwt({
  secret: _getSecret,
  userProperty: 'payload',
  getToken: _getTokenFromHeaders,
  credentialsRequired: false
})

module.exports = {required, optional}

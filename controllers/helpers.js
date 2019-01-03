const jwt = require('jsonwebtoken')
const util = require('util')
const crypto = require('crypto')

function jwtPayload(req) {
  const tokenHeader = req.headers.Authorization || req.headers.authorization
  const token = tokenHeader.split(' ')[1]
  return jwt.decode(token)
}

async function activationTokenGen() {
  const qRandomBytes = util.promisify(crypto.randomBytes)
  const cryptedValue = await qRandomBytes(16)
  return cryptedValue.toString('hex')
}

function activationExpiration() {
  return new Date(Date.now() + 3600000) // 1 hour
}

module.exports = {jwtPayload, activationTokenGen, activationExpiration}

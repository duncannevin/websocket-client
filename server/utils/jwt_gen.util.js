const jwt = require('jsonwebtoken')

function jwtGen(payload) {
  const today = new Date()
  const expirationDate = new Date(today)
  expirationDate.setDate(today.getDate() + 60)

  return jwt.sign(Object.assign({exp: parseInt(expirationDate.getTime() / 1000, 10)}, payload), process.env.SESSION_SECRET)
}

module.exports = jwtGen

const {Router} = require('express')

const clientCookieRouter = Router()

clientCookieRouter.post('/setcookie', function (req, res) {
  const cookies = req.cookies
  const cookieToClear = Object.keys(cookies)[0]
  const body = req.body
  const key = Object.keys(body)[0]
  const value = body[key]
  res.clearCookie(cookieToClear).cookie(key, value).send({msg: 'Cooke set!'})
})

clientCookieRouter.get('/clearcookies', function (req, res) {

})

module.exports = clientCookieRouter

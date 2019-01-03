const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: 'WebSocket Client'})
})

router.post('/setcookie', function (req, res) {
  const cookies = req.cookies
  const cookieToClear = Object.keys(cookies)[0]
  const body = req.body
  const key = Object.keys(body)[0]
  const value = body[key]
  res.clearCookie(cookieToClear).cookie(key, value).send({msg: 'Cooke set!'})
})

router.get('/clearcookies', function (req, res) {

})

module.exports = router

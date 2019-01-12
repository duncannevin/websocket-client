const {Router} = require('express')

const indexRouter = Router()
/* GET home page. */
indexRouter.get('/', function (req, res, next) {
  res.render('index', {title: 'Awesome WebSocket Client'})
})

module.exports = indexRouter

const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const dotenv = require('dotenv')
const bluebird = require('bluebird')
const mongoose = require('mongoose')
const log4js = require('log4js')
const router = require('./routes')
const passport = require('passport')
const expressValidator = require('express-validator')
const app = express()

// Set environment variables
dotenv.config()

// Connect to MongoDB
const mongoUrl = process.env.MONGODB_URI
mongoose.set('useFindAndModify', false)
mongoose.Promise = bluebird
mongoose.connect(mongoUrl, {useNewUrlParser: true, useCreateIndex: true})
  .catch((err) => dbMsg = 'MongoDB connection failed: ' + err.code)

// configure passport
require('./configs/passport.config')(passport)

// configure
app.use(expressValidator())
app.use(log4js.connectLogger(log4js.getLogger('http'), {level: 'auto'}))
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())

// serve ui
app.use(express.static(path.join(__dirname, '../public')))

// routes
app.use(router)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// Server index.html page when request to the root is made
app.use('/', function (req, res, next) {
  res.sendfile('../public/index.html')
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  const status = err.status || 500
  res.status(status).send({code: status, msg: err.message})
})

module.exports = app

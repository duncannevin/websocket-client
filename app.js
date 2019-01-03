const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const dotenv = require('dotenv')
const url = require('url')
const bluebird = require('bluebird')
const mongoose = require('mongoose')
const log4js = require('log4js')
const {indexRouter, clientCookieRouter, authRouter} = require('./routes/index')
const passport = require('passport')
const app = express()

// Set environment variables
dotenv.config()

// Connect to MongoDB
const mongoUrl = process.env.MONGODB_URI
mongoose.Promise = bluebird
mongoose.connect(mongoUrl, {useNewUrlParser: true, useCreateIndex: true})
  .then(() => console.log('MongoDB connected:', process.env.MONGODB_URI))
  .catch((err) => console.error('MongoDB connection failed:', process.env.MONGODB_URI, err))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

// configure passport
require('./configs/passport.config')(passport)

// configure
app.use(log4js.connectLogger(log4js.getLogger('http'), {level: 'auto'}))
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(passport.initialize())
app.use(passport.session())

// routes
app.use('/', indexRouter)
app.use('/client_cookie', clientCookieRouter)
app.use('/auth', authRouter)
app.use('*', function (req, res) {
  res.redirect(url.parse(req.url).pathname)
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app

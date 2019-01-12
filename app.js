const createError = require('http-errors')
const express = require('express')
const hbs = require('express-handlebars')
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
const sassMiddleware = require('node-sass-middleware')
const app = express()

// Set environment variables
dotenv.config()

// Connect to MongoDB
const mongoUrl = process.env.MONGODB_URI
mongoose.Promise = bluebird
mongoose.connect(mongoUrl, {useNewUrlParser: true, useCreateIndex: true})
  .catch((err) => dbMsg = 'MongoDB connection failed: ' + err.code)

// view engine setup
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/'
}))
app.set('view engine', 'hbs')

// configure passport
require('./configs/passport.config')(passport)

// configure
app.use(expressValidator())
app.use(log4js.connectLogger(log4js.getLogger('http'), {level: 'auto'}))
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(passport.initialize())
app.use(passport.session())

// routes
app.use(router)
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

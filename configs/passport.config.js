const GitHubStrategy = require('passport-github2')
const GoogleStrategy = require('passport-google-oauth2')
const LocalStrategy = require('passport-local')
const {userDAO} = require('../daos')
const authLogger = require('log4js').getLogger('auth')
const {jwtGen} = require('../utils')

async function oauth2Callback(request, accessToken, refreshToken, profile, done) {
  const user = {
    _id: profile.id,
    username: profile.username,
    role: 'guest'
  }
  const jwt = {jwt: jwtGen(user)}
  done(null, Object.assign(user, jwt))
}

async function localAuthCallback(email, password, done) {
  try {
    const user = await userDAO.findByEmail(email)
    if (!user || !user.validatePassword(password)) {
      return done(null, false, {errors: {'email or password': 'is invalid'}})
    }
    return done(null, user)
  } catch (error) {
    authLogger.debug('local auth failed', error)
    done(error, null)
  }
}

function config(passport) {
  /**
   * @description Local auth
   */
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, localAuthCallback))

  /**
   * @description Github oauth
   */
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/github/callback'
  }, oauth2Callback))

  /**
   * @description Google oauth
   */
  passport.use(new GoogleStrategy.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback',
    passReqToCallback: true
  }, oauth2Callback))

  passport.serializeUser(function (user, done) {
    done(null, user)
  })

  passport.deserializeUser(function (obj, done) {
    done(null, obj)
  })
}

module.exports = config

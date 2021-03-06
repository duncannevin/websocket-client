const GitHubStrategy = require('passport-github2')
const GoogleStrategy = require('passport-google-oauth2')
const LocalStrategy = require('passport-local')
const { userDAO, socialDAO } = require('../daos')
const authLogger = require('log4js').getLogger('auth')
const { jwtGen } = require('../utils')

async function oauth2Callback (request, accessToken, refreshToken, profile, done) {
  try {
    const user = {
      socialId: profile.id,
      email: profile.email,
      username: profile.username,
      role: 'guest'
    }
    const savedUser = await socialDAO.save(user)
    done(null, savedUser)
  } catch (error) {
    done(error, null)
  }
}

async function localAuthCallback (email, password, done) {
  try {
    const user = await userDAO.findByEmail(email)
    if (!user || !user.validatePassword(password)) {
      return done(null, false, { errors: { 'email or password': 'is invalid' } })
    }
    return done(null, user)
  } catch (error) {
    authLogger.debug('local auth failed', error)
    done(error, null)
  }
}

function config (passport) {
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
    callbackURL: process.env.OAUTH_CALLBACK_URL
  }, oauth2Callback))

  passport.serializeUser(function (user, done) {
    done(null, user)
  })

  passport.deserializeUser(function (obj, done) {
    done(null, obj)
  })
}

module.exports = config

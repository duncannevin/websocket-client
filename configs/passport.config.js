const GitHubStrategy = require('passport-github2')
const GoogleStrategy = require('passport-google-oauth2')
const {userControl} = require('../controllers')
const {activationExpiration, activationTokenGen} = require('../controllers/helpers')
const {authLogger} = require('../utils/logger.util')

async function oauth2Callback(request, accessToken, refreshToken, profile, done) {
  const user = {
    display_name: profile.displayName,
    email: profile.emails[0].value,
    user_id: `${profile.provider}|${profile.id}`,
    role: 'guest'
  }
  try {
    user.activationToken = await activationTokenGen()
    user.activationExpires = activationExpiration() // does nothing at this point(not sure I will ever implement)
    const addedUser = await userControl.updateOrCreate(user)
    authLogger.info('oauth2 successful', profile.provider)
    done(undefined, addedUser)
  } catch (error) {
    authLogger.debug('oauth2 failed', profile.provider, error)
    done(error, undefined)
  }
}

function config (passport) {
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
    done(undefined, user.id)
  })

  passport.deserializeUser(async function (id, done) {
    try {
      const user = await userControl.findById(id)
      done(undefined, user)
    } catch (error) {
      done(error, undefined)
    }
  })
}

module.exports = config

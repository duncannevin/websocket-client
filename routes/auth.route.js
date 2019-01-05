const {Router} = require('express')
const authRouter = Router()
const {optional, required} = require('./auth')
const authControl = require('../controllers/auth.control')
const passport = require('passport')

authRouter.post('/register', optional, authControl.register)
authRouter.post('/login', optional, authControl.login)
authRouter.get('/github', optional, passport.authenticate('github', {session: false}));
authRouter.get('/github/callback', optional, passport.authenticate('github'), authControl.handleSocial);
authRouter.get('/google', optional, passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read'], session: false }));
authRouter.get('/google/callback', optional, passport.authenticate('google'), authControl.handleSocial);

module.exports = authRouter

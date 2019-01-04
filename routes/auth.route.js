const {Router} = require('express')
const authRouter = Router()
const {optional, required} = require('./auth')
const authControl = require('../controllers/auth.control')
const passport = require('passport')

authRouter.post('/register', optional, authControl.register)
authRouter.post('/login', optional, authControl.login)
// authRouter.get('/github', authControl.socialAuth('github', {session: false}));
// authRouter.get('/github/callback', authControl.socialAuth('github'), authControl.activate);
// authRouter.get('/google', authControl.socialAuth('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read'], session: false }));
// authRouter.get('/google/callback', authControl.socialAuth('google'), authControl.activate);

module.exports = authRouter

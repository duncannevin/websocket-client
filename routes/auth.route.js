const {Router} = require('express')
const {authControl} = require('../controllers')

const authRouter = Router()

authRouter.post('/login', authControl.login);
authRouter.post('/register', authControl.register);
authRouter.get('/activate/:activationToken', authControl.activate);
authRouter.get('/exists/username/:username', authControl.usernameExistsCheck);
authRouter.get('/exists/email/:email', authControl.emailExistsCheck);
authRouter.get('/github', authControl.socialAuth('github', {session: false}));
authRouter.get('/github/callback', authControl.socialAuth('github'), authControl.activate);
authRouter.get('/google', authControl.socialAuth('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read'], session: false }));
authRouter.get('/google/callback', authControl.socialAuth('google'), authControl.activate);

module.exports = authRouter

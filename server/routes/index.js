const {Router} = require('express')
const router = Router()
const clientCookieRouter = require('./client_cookie.route')
const authRouter = require('./auth.route')
const userRouter = require('./user.route')
const connectionRouter = require('./connection.route')

router.use('/client_cookie', clientCookieRouter)
router.use('/auth', authRouter)
router.use('/users', userRouter)
router.use('/connection', connectionRouter)

module.exports = router

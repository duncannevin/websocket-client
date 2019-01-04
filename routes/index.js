const {Router} = require('express')
const router = Router()
const indexRouter = require('./index.route')
const clientCookieRouter = require('./client_cookie.route')
const authRouter = require('./auth.route')
const userRouter = require('./user.route')

router.use('/', indexRouter)
router.use('/client_cookie', clientCookieRouter)
router.use('/auth', authRouter)
router.use('/users', userRouter)

module.exports = router

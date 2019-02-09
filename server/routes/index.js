const {Router} = require('express')
const router = Router()
const authRouter = require('./auth.route')
const userRouter = require('./user.route')
const connectionRouter = require('./connection.route')

router.use('/auth', authRouter)
router.use('/users', userRouter)
router.use('/connection', connectionRouter)

module.exports = router

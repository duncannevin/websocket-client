const { Router } = require('express')
const userRouter = Router()
const { optional, required } = require('./auth')
const userControl = require('../controllers/user.control')

userRouter.get('/get_social', optional, userControl.getSocialUser)
userRouter.get('/all', required, userControl.getUsers)

module.exports = userRouter

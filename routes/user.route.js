const {Router} = require('express')
const authRouter = Router()
const {optional, required} = require('./auth')
const userControl = require('../controllers/user.control')

authRouter.get('/all', required, userControl.getUsers)

module.exports = authRouter

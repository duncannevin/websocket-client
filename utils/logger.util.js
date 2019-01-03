const {getLogger} = require('log4js')

const todoLogger = getLogger('todo')
const userLogger = getLogger('user')
const authLogger = getLogger('auth')
const startupLog = getLogger('startup')

module.exports = {todoLogger, userLogger, authLogger, startupLog}

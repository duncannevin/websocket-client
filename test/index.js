const expect = require('chai').expect
const authSpec = require('./auth.spec')
const connectionSpec = require('./connection.spec')
const {userDAO} = require('../server/daos')

describe('Websocket Client Spec', function () {
  after(() => {
    userDAO.deleteOne('tester@chester.com')
  })

  describe('Auth', () => {
    authSpec()
  })

  describe('Connection', () => {
    connectionSpec()
  })
})

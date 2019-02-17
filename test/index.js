const expect = require('chai').expect
const authSpec = require('./auth.spec')
const connectionSpec = require('./connection.spec')
const {userDAO} = require('../server/daos')
const userForm = {
  email: 'tester@chester.com',
  password: 'PASSWORD'
}

describe('Websocket Client Spec', function () {
  after(function (done) {
    userDAO.deleteOne(userForm.email)
    done()
  })

  describe('Auth', () => {
    authSpec()
  })

  describe('Connection', () => {
    connectionSpec()
  })
})

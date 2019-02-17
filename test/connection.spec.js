const chai = require('chai')
const {expect} = chai
const chaiHttp = require('chai-http')
const app = require('../server/app')
const {userDAO} = require('../server/daos')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const should = chai.should()
chai.use(chaiHttp)

const userForm = {
  email: 'tester@chester.com',
  password: 'PASSWORD'
}
const {regRoute, loginRoute} = {regRoute: '/auth/register', loginRoute: '/auth/login'}
let authHeader

function connectionSpec () {
  before(() => {
    chai.request(app)
      .post(loginRoute)
      .send(userForm)
      .end((err, {body}) => {
        if (err) return console.error(err)
        authHeader = 'Token ' + body.token
      })
  })
  it('should do something', () => {
    console.log(authHeader)
  })
}

module.exports = connectionSpec

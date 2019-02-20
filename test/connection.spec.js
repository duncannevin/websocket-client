const chai = require('chai')
const { expect } = chai
const chaiHttp = require('chai-http')
const app = require('../server/app')
const { userDAO, connectionDAO } = require('../server/daos')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const should = chai.should()
chai.use(chaiHttp)

const {
  loginRoute,
  createConnectionRoute,
  createBody,
  createCookie
} = require('./routes')

const userForm = {
  email: 'tester@chester.com',
  password: 'PASSWORD'
}

function connectionSpec () {
  before(() => {
    chai.request(app)
      .post(loginRoute)
      .send(userForm)
      .end((err, { body: { user: { token } } }) => {
        if (err) return console.error(err)
        chai.authHeader = 'Token ' + token
      })
  })

  it('should not add un-authenticated connection to database', (done) => {
    chai.request(app)
      .post(createConnectionRoute)
      .send({ url: 'not@nothing.com', name: 'nothing' })
      .end((err, { body: { __v, ...connection } }) => {
        if (err) return console.error(err)
        connection.should.be.an('object')
        expect(connection).to.have.keys(['url', '_id', 'userId', 'name', 'cookies', 'bodies', 'responses'])
        connectionDAO.getConnection({ connectionId: connection._id })
          .then((connArray) => {
            expect(connArray).to.have.length(0)
            done()
          })
          .catch((err) => {
            console.error(err)
            done()
          })
      })
  })

  it('should add authenticated connection to database', (done) => {
    chai.request(app)
      .post(createConnectionRoute)
      .set('authorization', chai.authHeader)
      .send({ url: 'www.sss.com', name: 'some-connection' })
      .end((err, { body: { __v, ...connection } }) => {
        if (err) return console.error(err)
        connection.should.be.an('object')
        expect(connection).to.have.keys(['url', '_id', 'userId', 'name', 'cookies', 'bodies', 'responses'])
        chai.connection = connection
        connectionDAO.getConnection({ connectionId: connection._id })
          .then((connArray) => {
            expect(connArray).to.have.length(1)
            done()
          })
          .catch((err) => {
            console.error(err)
            done()
          })
      })
  })

  it('should not add un-authenticated body to database', (done) => {
    const sendBody = { name: 'body1', connectionId: chai.connection._id }
    chai.request(app)
      .post(createBody)
      .send(sendBody)
      .end((err, { body: { wsBody, wsResponse } }) => {
        if (err) return console.error(err)
        expect(wsBody).to.have.keys(['name', 'content', 'lang', '_id'])
        expect(wsResponse).to.have.keys(['bodyName', 'contents', 'bodyId', '_id'])
        connectionDAO.getConnection({ connectionId: chai.connection._id })
          .then(([{ bodies, responses }]) => {
            bodies.should.have.length(0)
            responses.should.have.length(0)
            done()
          })
          .catch((err) => {
            console.error(err)
            done()
          })
      })
  })

  it('should add authenticated body to database', (done) => {
    const sendBody = { name: 'body1', connectionId: chai.connection._id }
    chai.request(app)
      .post(createBody)
      .set('authorization', chai.authHeader)
      .send(sendBody)
      .end((err, { body: { wsBody, wsResponse } }) => {
        if (err) return console.error(err)
        expect(wsBody).to.have.keys(['name', 'content', 'lang', '_id'])
        expect(wsResponse).to.have.keys(['bodyName', 'contents', 'bodyId', '_id'])
        connectionDAO.getConnection({ connectionId: chai.connection._id })
          .then(([{ bodies, responses }]) => {
            expect(bodies[0]._id.toString()).to.equal(wsBody._id)
            expect(responses[0].bodyId).to.equal(wsBody._id)
            done()
          })
          .catch((err) => {
            console.error(err)
            done()
          })
      })
  })

  it ('should not add un-authenticated cookie to database', (done) => {
    const sendBody = { connectionId: chai.connection._id, key: 'hope', value: 'saves'}
    chai.request(app)
      .post(createCookie)
      .send(sendBody)
      .end((err, { body }) => {
        if (err) return console.error(err)
        expect(body).to.have.keys(['key', 'value'])
        connectionDAO.getConnection({ connectionId: chai.connection._id })
          .then(([{cookies}]) => {
            cookies.should.have.length(0)
            done()
          })
          .catch((err) => {
            console.error(err)
            done()
          })
      })
  })

  it ('should add authenticated cookie to database', (done) => {
    const sendBody = { connectionId: chai.connection._id, key: 'hope', value: 'saves'}
    chai.request(app)
      .post(createCookie)
      .set('authorization', chai.authHeader)
      .send(sendBody)
      .end((err, { body }) => {
        if (err) return console.error(err)
        expect(body).to.have.keys(['key', 'value'])
        connectionDAO.getConnection({ connectionId: chai.connection._id })
          .then(([{cookies}]) => {
            cookies.should.have.length(1)
            done()
          })
          .catch((err) => {
            console.error(err)
            done()
          })
      })
  })
}

module.exports = connectionSpec

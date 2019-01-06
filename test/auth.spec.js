const chai = require('chai');
const {expect} = chai
const chaiHttp = require('chai-http');
const app = require('../app')
const {userDAO} = require('../daos')
const jwt = require('jsonwebtoken')
const should = chai.should()
chai.use(chaiHttp)
const userForm = {
  email: 'tester@chester.com',
  password: 'PASSWORD'
}

function authSpec () {
  beforeEach((done) => {
    done()
  })

  after(function (done) {
    userDAO.deleteOne(userForm.email)
    done()
  })

  describe('POST /register', () => {
    const route = '/auth/register'

    it('should return 201 when a new user is added', (done) => {
      chai.request(app)
        .post(route)
        .send(userForm)
        .end((err, res) => {
          if (err) return console.log(err)
          res.should.have.status(201)
          res.body.should.have.property('user')
          expect(res.body.user).to.have.keys(['_id', 'email', 'token'])
          expect(jwt.verify(res.body.user.token, process.env.SESSION_SECRET)).to.be.an('object')
          expect(jwt.verify(res.body.user.token, process.env.SESSION_SECRET)).to.have.keys(['exp', 'email', 'id', 'role', 'iat'])
          done()
        })
    })

    it('should return 409 if user already exists', (done) => {
      chai.request(app)
        .post(route)
        .send(userForm)
        .end((err, res) => {
          if (err) return console.log(err)
          res.should.have.status(409)
          res.body.should.have.keys(['msg', 'code'])
          done()
        })
    })
  })

  describe('POST /login', function () {
    const route = '/auth/login'

    it('should return 200 upon successful login', (done) => {
      chai.request(app)
        .post(route)
        .send(userForm)
        .end((err, res) => {
          if (err) return console.log(err)
          res.should.have.status(200)
          res.body.should.have.property('user')
          expect(res.body.user).to.have.keys(['_id', 'email', 'token'])
          expect(jwt.verify(res.body.user.token, process.env.SESSION_SECRET)).to.be.an('object')
          expect(jwt.verify(res.body.user.token, process.env.SESSION_SECRET)).to.have.keys(['exp', 'email', 'id', 'role', 'iat'])
          done()
        })
    })

    it('should return 401 unauthorized with bad credentials', (done) => {
      chai.request(app)
        .post(route)
        .send(Object.assign(userForm, {password: 'notit'}))
        .end((err, res) => {
          if (err) return console.log(err)
          res.should.have.status(401)
          res.body.should.have.keys(['msg', 'code'])
          done()
        })
    })
  })
}

module.exports = authSpec

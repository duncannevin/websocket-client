const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app')
const {userDAO} = require('../daos')
const should = chai.should()
chai.use(chaiHttp)
const userForm = {
  email: 'tester@chester.com',
  password: 'PASSWORD',
  lname: 'Tester',
  fname: 'Chester',
  role: 'guest',
  username: 'testerchester'
}

let user, JWT

function authSpec () {
  beforeEach((done) => {
    done()
  })

  afterEach((done) => {
    try {
      userDAO.deleteOne(userForm.username)
      done()
    } catch (error) {
      console.error(error)
    }
  })

  describe('POST /register', () => {
    const route = '/auth/register'

    it('should return 201', (done) => {
      chai.request(app)
        .post(route)
        .send(userForm)
        .end((err, res) => {
          if (err) return console.log(err)
          res.should.have.status(201)
          res.body.should.have.property('user_id')
          done()
        })
    })

    it('should return 409', (done) => {
      chai.request(app)
        .post(route)
        .send(userForm)
        .end((err, res) => {
          if (err) return console.log(err)
          res.should.have.status(409)
          done()
        })
    })
  })

  // describe('GET /activate/:activationToken', () => {
  //   const route = '/auth/activate'
  //   const BAD_TOKEN = '123456789'
  //
  //   it('should return 400', (done) => {
  //     chai.request(app).get(`${route}/${BAD_TOKEN}`)
  //       .expect(400, done)
  //   })
  //
  //   it('should return 200', (done) => {
  //     chai.request(app).get(`${route}/${user.activationToken}`)
  //       .then(res => {
  //         JWT = res.body.token
  //         expect(res.status).toEqual(200)
  //         done()
  //       })
  //   })
  // })
  //
  // describe('POST /login', () => {
  //   const route = '/auth/login'
  //
  //   it('should return 401, missing password', (done) => {
  //     chai.request(app).post(route).send({email: 'some@email.com'})
  //       .expect(401, done)
  //   })
  //
  //   it('should return 401, missing email', (done) => {
  //     chai.request(app).post(route).send({password: 'somepassword'})
  //       .expect(401, done)
  //   })
  //
  //   it('should return 404', (done) => {
  //     chai.request(app).post(route).send({email: 'none@nowhere.com', password: 'PASSWORD'})
  //       .expect(404, done)
  //   })
  //
  //   it('should return 200', (done) => {
  //     request(app).post('/auth/login').send({email: 'tester@chester.com', password: 'PASSWORD'})
  //       .expect(200, done)
  //   })
  // })
}

module.exports = authSpec

import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import app from '../src/index';

chai.use(chaiHttp);
chai.should();
const dummyUser = {
  firstname: 'firstname',
  lastname: 'secondname',
  username: 'username',
  email: 'dummyuser@gmail.com',
  password: 'dummydummy',
};
const { expect } = chai;
const { JWT_SECRET } = process.env;
let validtoken = null;
const invalidtoken = jwt.sign({ email: 'technites@gmail.com' }, JWT_SECRET, { expiresIn: '1ms' });

describe('users endpoints', () => {
  describe('POST api/v1/auth', () => {
    it('it should create a user', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/register')
        .send(dummyUser)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('data').be.a('object');
          res.body.should.have.property('token').be.a('string');
          done();
        });
    });

    it('it should return error if user already exists', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/register')
        .send(dummyUser)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.have.property('error').eql(`User with email ${dummyUser.email} already exists`);
          done();
        });
    });
  });
  describe('POST api/v1/auth/reset', () => {
    it('Should not send reset link when email is not registered', (done) => {
      chai.request(app)
        .post('/api/v1/auth/reset')
        .set('Accept', 'application/json')
        .send({ email: 'rugumbirajordybastien@gmail.com' })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
    });
    it('Should send reset link when informations are correct', async () => {
      const result = await chai.request(app)
        .post('/api/v1/auth/reset')
        .set('Accept', 'application/json')
        .send({ email: 'technitesdev@gmail.com' });
      validtoken = result.body.data;
      expect(result.body.status).to.equal(200);
    });
  });

  describe('POST api/v1/auth/reset/:token', () => {
    it('Should not reset password when password missmatch', (done) => {
      chai.request(app)
        .put(`/api/v1/auth/reset/${validtoken}`)
        .set('Accept', 'application/json')
        .send({ password: '123456', confirm_password: '1234567' })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
    });
    it('Should reset password when all informations are correct', (done) => {
      chai.request(app)
        .put(`/api/v1/auth/reset/${validtoken}`)
        .set('Accept', 'application/json')
        .send({ password: '123456', confirm_password: '123456' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });
    it('Should not reset password when token has expired', (done) => {
      chai.request(app)
        .put(`/api/v1/auth/reset/${invalidtoken}`)
        .set('Accept', 'application/json')
        .send({ password: '123456', confirm_password: '123456' })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
    });
  });
});

/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import app from '../src/index';
import mailHelper from '../src/utils/Mail';

chai.use(chaiHttp);
const { expect } = chai;
const { JWT_SECRET } = process.env;
const email = 'technitesdev@gmail.com';
let validtoken = null;
const invalidtoken = jwt.sign({ email: 'technites@gmail.com' }, JWT_SECRET, { expiresIn: '1ms' });
describe('Testing Routes : User', () => {
    describe('POST api/v1/auth/reset', () => {
        it('Should not send reset link when email is not registered', (done) => {
          chai.request(app)
            .post('/api/v1/auth/reset')
            .set('Accept', 'application/json')
            .send({ email: 'rugumbirajordybastien@gmail.com' })
            .end((err, res) => {
              expect(res.status).to.equal(409);
              done();
            });
        });
        it('Should send reset link when informations are correct', (done) => {
          chai.request(app)
            .post('/api/v1/auth/reset')
            .set('Accept', 'application/json')
            .send({ email: 'technitesdev@gmail.com' })
            .end((err, res) => {
              validtoken = res.body.data;
              expect(res.status).to.equal(200);
              done();
            });
        });
});

describe('POST api/v1/auth/reset/:token', () => {
  it('Should not reset password when password missmatch', (done) => {
    chai.request(app)
      .patch(`/api/v1/auth/reset/${validtoken}`)
      .set('Accept', 'application/json')
      .send({ password: '123456', confirm_password: '1234567' })
      .end((err, res) => {
        expect(res.status).to.equal(409);
        done();
      });
  });
  it('Should reset password when all informations are correct', (done) => {
    chai.request(app)
      .patch(`/api/v1/auth/reset/${validtoken}`)
      .set('Accept', 'application/json')
      .send({ password: '123456', confirm_password: '123456' })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });
  it('Should not reset password when token has expired', (done) => {
    chai.request(app)
      .patch(`/api/v1/auth/reset/${invalidtoken}`)
      .set('Accept', 'application/json')
      .send({ password: '123456', confirm_password: '123456' })
      .end((err, res) => {
        expect(res.status).to.equal(409);
        done();
      });
  });
});
});

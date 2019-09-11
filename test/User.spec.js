import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import app from '../src/index';
import user from '../src/database/models/user';

chai.use(chaiHttp);
chai.should();

const loginUrl = '/api/v1/auth/login';
const signUpUrl = '/api/v1/auth/register';

const dummyUser = {
  firstname: 'firstname',
  lastname: 'secondname',
  username: 'username',
  email: 'dummyuser@gmail.com',
  password: 'dummy12@',
};
const { JWT_SECRET } = process.env;
let validtoken = null;
const invalidtoken = jwt.sign({ email: 'technites@gmail.com' }, JWT_SECRET, { expiresIn: '1ms' });

describe('users endpoints', () => {
  const dummyUser = {
    firstname: 'firstname',
    lastname: 'secondname',
    username: 'username',
    email: 'dummyuser@gmail.com',
    password: 'dummydummy',
  };

  describe('POST api/v1/auth', () => {
    it('it should create a user', (done) => {
      chai
        .request(app)
        .post(signUpUrl)
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

    it('it should return error if invalid data is entered on the request', (done) => {
      dummyUser.password = 'password';
      chai
        .request(app)
        .post('/api/v1/auth/register')
        .send(dummyUser)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.have.property('error');
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

  describe('PUT api/v1/auth/reset/:token', () => {
    it('Should not reset password when password missmatch', (done) => {
      chai.request(app)
        .put(`/api/v1/auth/reset/${validtoken}`)
        .set('Accept', 'application/json')
        .send({ password: '123456aA@', confirm_password: '123456aB@' })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
    });
    it('Should not reset password when password doesnt follow regex', (done) => {
      chai.request(app)
        .put(`/api/v1/auth/reset/${validtoken}`)
        .set('Accept', 'application/json')
        .send({ password: '123456', confirm_password: '123456' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
    });
    it('Should reset password when all informations are correct', (done) => {
      chai.request(app)
        .put(`/api/v1/auth/reset/${validtoken}`)
        .set('Accept', 'application/json')
        .send({ password: '123456aA@', confirm_password: '123456aA@' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });
    it('Should not reset password when token has expired', (done) => {
      chai.request(app)
        .put(`/api/v1/auth/reset/${invalidtoken}`)
        .set('Accept', 'application/json')
        .send({ password: '123456aA@', confirm_password: '123456aA@' })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
    });
  });

  describe('POST: /api/v1/auth/login', () => {
    let userData;
    it('Should not login an unregistered user', () => {
      userData = {
        email: 'new@mail.com',
        password: 'Anyp4ss'
      };
      chai
        .request(app)
        .post(loginUrl)
        .send(userData)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.error).to.equal('invalid user credentials');
        });
    });

    it('Should not login a user with an invalid password', () => {
      userData = {
        email: dummyUser.email,
        password: 'wrongPass'
      };
      chai
        .request(app)
        .post(loginUrl)
        .send(userData)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.error).to.equal('invalid user credentials');
        });
    });

    it('should not log in a user without a password', (done) => {
      userData = {
        email: dummyUser.email,
        password: ''
      };
      chai
        .request(app)
        .post(loginUrl)
        .send(userData)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.error).to.equal('invalid user credentials');
          done();
        });
    });
    it('should not log in a user without email', (done) => {
      userData = {
        email: '',
        password: 'Anyp4ss'
      };
      chai
        .request(app)
        .post(loginUrl)
        .send(userData)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.error).to.equal('invalid user credentials');
          done();
        });
    });

  });

  describe('POST: /api/v1/auth/login', () => {
    let userData;
    it('Should not login an unregistered user', () => {
      userData = {
        email: 'new@mail.com',
        password: 'Anyp4ss'
      };
      chai
        .request(app)
        .post(loginUrl)
        .send(userData)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.error).to.equal('invalid user credentials');
        });
    });

    it('Should not login a user with an invalid password', () => {
      userData = {
        email: dummyUser.email,
        password: 'wrongPass'
      };
      chai
        .request(app)
        .post(loginUrl)
        .send(userData)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.error).to.equal('invalid user credentials');
        });
    });

    it('should not log in a user without a password', (done) => {
      userData = {
        email: dummyUser.email,
        password: ''
      };
      chai
        .request(app)
        .post(loginUrl)
        .send(userData)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.error).to.equal('Password is required to login');
          done();
        });
    });
    it('should not log in a user without email', (done) => {
      userData = {
        email: '',
        password: 'Anyp4ss'
      };
      chai
        .request(app)
        .post(loginUrl)
        .send(userData)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.error).to.equal('Email is required to login');
          done();
        });
    });

    it('Should login a registered user', () => {
      userData = {
        email: dummyUser.email,
        password: dummyUser.password
      };
      chai
        .request(app)
        .post(loginUrl)
        .send(userData)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('you have successfully logged in');
        });
    });
  });
});

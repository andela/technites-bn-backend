import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/index';

chai.use(chaiHttp);
chai.should();

const loginUrl = '/api/v1/auth/login';
const signUpUrl = '/api/v1/auth/register';

const dummyUser = {
  firstname: 'firstname',
  lastname: 'secondname',
  username: 'username',
  email: 'dummyuser@gmail.com',
  password: 'dummydummy',
};

describe('users endpoints', () => {
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
  });
});

describe('Test user login with Email and password Endpoint', () => {
  it('Should not login an unregistered user', () => {
    const userData = {
      email: 'new@mail.com',
      password: 'Anyp4ss'
    };
    chai
      .request(app)
      .post(loginUrl)
      .send(userData)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('invalid user credentials');
      });
  });

  it('Should not login a user with an invalid password', () => {
    const userData = {
      email: 'test@user.com',
      password: 'wrongPass'
    };
    chai
      .request(app)
      .post(loginUrl)
      .send(userData)
      .end((err, res) => {
        expect(res.status).to.equal(403);
        expect(res.body.message).to.equal('iinvalid user credentials');
      });
  });

  it('should not log in a user without a password', (done) => {
    const userData = {
      email: 'test@MediaList.com'
    };
    chai
      .request(app)
      .post(loginUrl)
      .send(userData)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.errors.password[0]).to.equal('Password is required to login');
        done();
      });
  });
  it('should not log in a user without email', (done) => {
    const userData = {
      password: 'Anyp4ss'
    };
    chai
      .request(app)
      .post(loginUrl)
      .send(userData)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.errors.name[0]).to.equal('Email is required to login');
        done();
      });
  });

  it('Should login a registered user', () => {
    const userData = {
      email: 'user@mail.com',
      password: 'Anyp4ss'
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

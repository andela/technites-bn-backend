import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import app from '../src/index';
import UserService from '../src/services/UserServices';

chai.use(chaiHttp);
chai.should();

const { findTokenByUserID } = UserService;
const signUpUrl = '/api/v1/auth/register';
const loginUrl = '/api/v1/auth/login';
const logoutUrl = '/api/v1/auth/logout';

const { JWT_SECRET } = process.env;
let validtoken = null;
const invalidtoken = jwt.sign({ email: 'technites@gmail.com', use: 'Reset' }, JWT_SECRET, { expiresIn: '1ms' });
const invalidtoken2 = jwt.sign({ email: 'technitesdev@gmail.com' }, JWT_SECRET, { expiresIn: '600s' });

describe('users endpoints', () => {
  let token;
  let testId;
  const dummyUser = {
    firstname: 'firstname',
    lastname: 'secondname',
    username: 'username',
    email: 'dummyuser@gmail.com',
    password: 'dummy12@',
  };

  describe('POST api/v1/auth', () => {
    it('it should create a user', (done) => {
      chai
        .request(app)
        .post(signUpUrl)
        .send(dummyUser)
        .end((err, res) => {
          token = res.body.token;
          testId = Number(res.body.data.id);
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
      dummyUser.email = 'password';
      chai
        .request(app)
        .post(signUpUrl)
        .send(dummyUser)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.have.property('error');
          done();
        });
    });
  });
  // This test needs to run before user verification, token is from dummy user
  describe('PATCH api/v1/user/editprofile', () => {
    it('Should not allow user to edit profile when user is not verified', (done) => {
      chai.request(app)
        .patch('/api/v1/editprofile')
        .set('Authorization', `${token}`)
        .send({ gender: 'Male' })
        .end((err, res) => {
          expect(res.body.status).to.equal(401);
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
    it('Should send reset link when informations are correct', (done) => {
      chai.request(app)
        .post('/api/v1/auth/reset')
        .set('Accept', 'application/json')
        .send({ email: 'technitesdev@gmail.com' })
        .end((err, res) => {
          expect(res.body.status).to.equal(200);
          done();
        });
    });
  });

  describe('PUT api/v1/auth/reset/:token', () => {
    it('Should reset password when all informations are correct', async () => {
      const userInfo = await findTokenByUserID(1);
      validtoken = userInfo.token;
      const result2 = await chai.request(app)
        .put(`/api/v1/auth/reset/${validtoken}`)
        .set('Accept', 'application/json')
        .send({ password: '123456aA@', confirm_password: '123456aA@' });
      expect(result2.status).to.equal(200);
    });
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
    it('Should not reset password when token used is not for resetting', (done) => {
      chai.request(app)
        .put(`/api/v1/auth/reset/${invalidtoken2}`)
        .set('Accept', 'application/json')
        .send({ password: '123456aA@', confirm_password: '123456aA@' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
    });
    it('Should not reset password when token has been used', (done) => {
      chai.request(app)
        .put(`/api/v1/auth/reset/${validtoken}`)
        .set('Accept', 'application/json')
        .send({ password: '123456aA@', confirm_password: '123456aA@' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
    });
    it('Should not reset password when token has expired', (done) => {
      chai.request(app)
        .put(`/api/v1/auth/reset/${invalidtoken}`)
        .set('Accept', 'application/json')
        .send({ password: '123456aA@', confirm_password: '123456aA@' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
    });
  });

  describe('POST: /api/v1/auth/login', () => {
    let userData;
    it('Should not login an unregistered user', (done) => {
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
          expect(res.body.error).to.equal('Invalid user credentials');
          done();
        });
    });

    it('Should not login a user with an invalid password', (done) => {
      userData = {
        email: dummyUser.email,
        password: 'wrongPass'
      };
      chai
        .request(app)
        .post(loginUrl)
        .send(userData)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.error).to.equal('Invalid user credentials');
          done();
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
          expect(res.body.status).to.equal(422);
          expect(res.body.error[0].msg).to.equal('Invalid user credentials');
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
          expect(res.body.error).to.equal('Invalid user credentials');
          done();
        });
    });
  });

  describe('POST api/v1/auth/login/:token', () => {
    let confirmationToken = jwt.sign(dummyUser, process.env.JWT_SECRET, { expiresIn: '24h' });
    const exec = () => chai.request(app).get(`/api/v1/auth/login/${confirmationToken}`);
    it('should return 200 if a user is verified', async () => {
      const res = await exec();
      res.should.have.status(200);
      res.body.should.have.property('message');
    });
    it('should return 400 if confirmationToken is invalid', async () => {
      confirmationToken = 'a';
      const res = await exec();
      res.should.have.status(400);
    });
  });
  // This test needs to run before logging out user, token is from dummy user
  describe('PATCH api/v1/editprofile', () => {
    it('Should not allow user to edit profile to email that already exists', (done) => {
      chai.request(app)
        .patch('/api/v1/editprofile')
        .set('Authorization', `${token}`)
        .send({ email: 'technitesdev@gmail.com' })
        .end((err, res) => {
          expect(res.body.status).to.equal(409);
          done();
        });
    });
    it('Should not accept uploads that are not images', async () => {
      const userUpdate = await chai.request(app)
        .patch('/api/v1/editprofile')
        .set('Authorization', `${token}`)
        .attach('image', 'src/utils/assets/Test.rtf', 'Test.rtf');
      expect(userUpdate.body.status).to.equal(415);
    });
    it('Should update profile on demand', (done) => {
      chai.request(app)
        .patch('/api/v1/editprofile')
        .set('Authorization', `${token}`)
        .attach('image', 'src/utils/assets/Profile.png', 'Profile.png')
        .end((err, res) => {
          expect(res.body.status).to.equal(200);
        });
      done();
    });
  });

  describe('users logout endpoints', () => {
    it('should logout a logged in user', (done) => {
      chai
        .request(app)
        .post(logoutUrl)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('message');
          done();
        });
    });
  });

  describe('GET api/v1/user/1', () => {
    it('Should not return specific profile if parameter is not an integer', (done) => {
      chai.request(app)
        .get('/api/v1/a')
        .set('Accept', 'application/json')
        .send()
        .end((err, res) => {
          expect(res.body.status).to.equal(400);
          done();
        });
    });
    it('Should return an appropriate message when user is not found', (done) => {
      chai.request(app)
        .get('/api/v1/100')
        .set('Accept', 'application/json')
        .send()
        .end((err, res) => {
          expect(res.body.status).to.equal(404);
          done();
        });
    });
    it('Should return user when found', (done) => {
      chai.request(app)
        .get(`/api/v1/${testId}`)
        .set('Accept', 'application/json')
        .send()
        .end((err, res) => {
          expect(res.body.status).to.equal(200);
          done();
        });
    });
    it('Should return all users', (done) => {
      chai.request(app)
        .get('/api/v1/users/all')
        .set('Accept', 'application/json')
        .send()
        .end((err, res) => {
          expect(res.body.status).to.equal(200);
          done();
        });
    });
    it('Should not return users of a specific company in case they are not found', (done) => {
      chai.request(app)
        .get('/api/v1/users/company/Andela')
        .set('Accept', 'application/json')
        .send()
        .end((err, res) => {
          expect(res.body.status).to.equal(404);
          done();
        });
    });
  });
});

/* eslint-disable no-unused-vars */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/index';

chai.use(chaiHttp);
chai.should();

describe('users endpoints', () => {
  let adminToken;
  const dummyUser = {
    firstname: 'firstname',
    lastname: 'secondname',
    username: 'username',
    email: 'dummyuserttt@gmail.com',
    password: 'dummy12@',
  };

  describe('Change user roles', () => {
    it('it should create a user to get his id', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/register')
        .send(dummyUser)
        .end((err, res) => {
          res.should.have.status(201);
          done();
        });
    });

    it('should log in a user with correct credentials', (done) => {
      const userData = {
        email: 'technitesdev@gmail.com',
        password: process.env.SUPER_ADMIN_PASS
      };
      chai
        .request(app)
        .post('/api/v1/auth/login')
        .send(userData)
        .end((err, res) => {
          res.should.have.status(200);
          adminToken = res.body.data.token;
          done();
        });
    });

    it('it should not change a user role without token', (done) => {
      chai
        .request(app)
        .put('/api/v1/admin/users')
        .send({
          new_role: 4,
          email: dummyUser.email
        })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });

    it('it should not change a user role without proper post data, validation', (done) => {
      chai
        .request(app)
        .put('/api/v1/admin/users')
        .send({
          new_role: 'dfdf',
          email: dummyUser.email
        })
        .end((err, res) => {
          res.should.have.status(422);
          done();
        });
    });

    it('it should return an error if no email is given in body', (done) => {
      chai
        .request(app)
        .put('/api/v1/admin/users')
        .send({
          new_role: 5
        })
        .end((err, res) => {
          res.should.have.status(422);
          done();
        });
    });

    it('it should successfully update the role if no error', (done) => {
      chai
        .request(app)
        .put('/api/v1/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          new_role: 5,
          email: dummyUser.email
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('oldRole');
          done();
        });
    });
  });
});

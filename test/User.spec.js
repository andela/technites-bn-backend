import chai from 'chai';
import chaiHttp from 'chai-http';
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
});

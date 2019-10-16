import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import app from '../src/index';

chai.use(chaiHttp);
dotenv.config();

describe('Chat Application', () => {
  let userToken;
  const user = {
    email: 'requester@request.com',
    password: process.env.SUPER_ADMIN_PASS
  };

  const message = {
    to: 0,
    message: 'Hello world'
  };

  it('Should First login a user', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        userToken = res.body.data.token;
        done();
      });
  });

  it('Should post a public chat', (done) => {
    chai
      .request(app)
      .post('/api/v1/users/chat')
      .set('Authorization', `Bearer ${userToken}`)
      .send(message)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        done();
      });
  });

  it('Should get all the past chats', (done) => {
    chai
      .request(app)
      .get('/api/v1/users/chat')
      .set('Authorization', `Bearer ${userToken}`)
      .send(message)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });
});

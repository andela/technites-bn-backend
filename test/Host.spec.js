import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import AuthenticationHelper from '../src/utils/AuthHelper';
import app from '../src/index';
import UserService from '../src/services/UserServices';
import database from '../src/database/models';

chai.use(chaiHttp);
chai.should();

const { jwtSign, hashPassword } = AuthenticationHelper;
const { addUser } = UserService;
const token = jwtSign({ email: 'adminfortest@gmail.com' });
const token2 = jwtSign({ email: 'requesterfortest@gmail.com' });
const hostToken = jwtSign({ email: 'host@gmail.com' });
const newPassword = {
  password: hashPassword('123456aA@'),
};
let fakeHost = {
  email: null,
  password: null,
  confirm_password: null,
  old_password: null
};
describe('Hosts endpoints', () => {
  beforeEach(async () => {
    const admin = {
      firstname: 'admin',
      lastname: 'fortest',
      email: 'adminfortest@gmail.com',
      is_verified: true,
      role_value: 7,
    };
    await addUser(admin);

    const admin2 = {
      firstname: 'requester',
      lastname: 'fortest',
      email: 'requesterfortest@gmail.com',
      is_verified: true,
      role_value: 0,
    };
    await addUser(admin2);
  });
  afterEach(async () => {
    await database.User.destroy({ where: { email: 'adminfortest@gmail.com' } });
    await database.User.destroy({ where: { email: 'requesterfortest@gmail.com' } });
  });
  xdescribe('POST api/v1/hosts', () => {
    const host = {
      email: 'host@gmail.com',
      firstname: 'new',
      lastname: 'host'
    };
    it('it should add a new host', async () => {
      const newHost = await chai.request(app)
        .post('/api/v1/hosts')
        .set('Authorization', `Bearer ${token}`)
        .send(host);
      expect(newHost.body.status).to.equal(201);
    });
    it('it should not add a new host while he is already registered', (done) => {
      chai.request(app)
        .post('/api/v1/hosts')
        .set('Authorization', `Bearer ${token}`)
        .send(host)
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });
    it('it should not add a new host with a user that does not have the ability', (done) => {
      chai.request(app)
        .post('/api/v1/hosts')
        .set('Authorization', `Bearer ${token2}`)
        .send(host)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });

  xdescribe('PATCH api/v1/hosts/reset', () => {
    it('it should not reset hosts when email does not exist', (done) => {
      fakeHost = {
        email: 'fakehost@gmail.com',
        password: '123aA@',
        confirm_password: '123aA@123',
        old_password: '123456aA@'
      };
      database.User.update(newPassword, { where: { email: 'host@gmail.com' } });
      chai.request(app)
        .patch('/api/v1/hosts/reset')
        .set('Authorization', `Bearer ${hostToken}`)
        .send(fakeHost)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
    it('it should not reset hosts password when new passwords missmatch', (done) => {
      fakeHost = {
        email: 'host@gmail.com',
        password: '123aA@',
        confirm_password: '123aA@123',
        old_password: '123456aA@'
      };
      database.User.update(newPassword, { where: { email: 'host@gmail.com' } });
      chai.request(app)
        .patch('/api/v1/hosts/reset')
        .set('Authorization', `Bearer ${hostToken}`)
        .send(fakeHost)
        .end((err, res) => {
          res.should.have.status(409);
          done();
        });
    });
    it('it should not reset hosts password when old password missmatch', (done) => {
      fakeHost = {
        email: 'host@gmail.com',
        password: '123aA@',
        confirm_password: '123aA@',
        old_password: '12345678'
      };
      chai.request(app)
        .patch('/api/v1/hosts/reset')
        .set('Authorization', `Bearer ${hostToken}`)
        .send(fakeHost)
        .end((err, res) => {
          res.should.have.status(409);
          done();
        });
    });

    const hostInfo = {
      email: 'host@gmail.com',
      password: '123aA@',
      confirm_password: '123aA@',
      old_password: '123456aA@'
    };

    it('it should reset hosts password', (done) => {
      database.User.update(newPassword, { where: { email: 'host@gmail.com' } });
      chai.request(app)
        .patch('/api/v1/hosts/reset')
        .set('Authorization', `Bearer ${hostToken}`)
        .send(hostInfo)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it('it should not reset hosts password when he is already verified', (done) => {
      database.User.update(newPassword, { where: { email: 'host@gmail.com' } });
      chai.request(app)
        .patch('/api/v1/hosts/reset')
        .set('Authorization', `Bearer ${hostToken}`)
        .send(hostInfo)
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });
  });
});

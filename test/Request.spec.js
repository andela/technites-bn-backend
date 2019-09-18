import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/index';
import AuthHelper from '../src/utils/AuthHelper';

chai.use(chaiHttp);
chai.should();

const { jwtSign } = AuthHelper;
const token = jwtSign({ email: 'technitesdev1@gmail.com' }, '4m');
const adminToken = jwtSign({ email: 'technitesdev@gmail.com' }, '4m');

describe('REQUESTS ENDPOINTS', () => {
  describe('GET api/v1/users/:id/requests', () => {
    it('it should return user requests', (done) => {
      chai
        .request(app)
        .get('/api/v1/users/1/requests')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data').be.a('array');
          res.body.should.have.property('message').be.a('string');
          done();
        });
    });
    it('it should return other users requests if is An Admin', (done) => {
      chai
        .request(app)
        .get('/api/v1/users/1/requests')
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data').be.a('array');
          res.body.should.have.property('message').be.a('string');
          done();
        });
    });
  });

  describe('POST api/v1/users/:id/requests', () => {
    const dummyRequest = {
      request_type: 'OneWay',
      location_id: '1',
      departure_date: '2019-10-23',
      destinations: 'given city',
      reason: 'my trip reason',
    };

    it('should return 404 if request_type is invalid', (done) => {
      dummyRequest.request_type = 'a';
      chai
        .request(app)
        .post('/api/v1/users/1/requests')
        .set('Authorization', `Bearer ${token}`)
        .send(dummyRequest)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error');
          done();
        });
    });
    it('it should create a one way trip request', (done) => {
      dummyRequest.request_type = 'OneWay';
      chai
        .request(app)
        .post('/api/v1/users/1/requests')
        .set('Authorization', `Bearer ${token}`)
        .send(dummyRequest)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('message');
          res.body.should.have.property('data').be.a('object');
          done();
        });
    });

    it('it should create a return trip request', (done) => {
      dummyRequest.request_type = 'ReturnTrip';
      dummyRequest.return_date = '2029-02-10';

      chai
        .request(app)
        .post('/api/v1/users/1/requests')
        .set('Authorization', `Bearer ${token}`)
        .send(dummyRequest)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('message');
          res.body.should.have.property('data').be.a('object');
          done();
        });
    });

    it('should return 404 when user creates a request with unregistered email', (done) => {
      const newToken = jwtSign({ email: 'notexists@gmail.com' }, '4m');
      chai
        .request(app)
        .post('/api/v1/users/1/requests')
        .set('Authorization', `Bearer ${newToken}`)
        .send(dummyRequest)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error');
          done();
        });
    });

    it('it should approve a user request', (done) => {
      chai
        .request(app)
        .post('/api/v1/users/1/requests/1/approve')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').be.a('string');
          done();
        });
    });

    it('it should reject a user request', (done) => {
      chai
        .request(app)
        .post('/api/v1/users/1/requests/1/reject')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').be.a('string');
          done();
        });
    });

    it('it should return 400 when data are invalid', (done) => {
      dummyRequest.reason = 1;
      chai
        .request(app)
        .post('/api/v1/users/1/requests/')
        .set('Authorization', `Bearer ${token}`)
        .send(dummyRequest)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').be.a('string');
          done();
        });
    });
  });
});

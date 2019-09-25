/* eslint-disable no-unused-vars */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/index';
import AuthHelper from '../src/utils/AuthHelper';

chai.use(chaiHttp);
chai.should();

const { jwtSign } = AuthHelper;
const token = jwtSign({ email: 'technitesdev1@gmail.com' }, '4m');
const token2 = jwtSign({ email: 'technitesdev3@gmail.com' }, '4m');
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
      location_id: 1,
      departure_date: '2020-09-25',
      destinations: [{
        destination_id: 2, accomodation_id: 1, check_in: '2020-09-25', check_out: '2020-09-25'
      },
      {
        destination_id: 2, accomodation_id: 1, check_in: '2020-09-25', check_out: '2020-09-25'
      }],
      reason: 'Medical'
    };

    it('should return 404 if request_type is invalid', (done) => {
      dummyRequest.request_type = 'a';
      chai
        .request(app)
        .post('/api/v1/requests')
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
        .post('/api/v1/requests')
        .set('Authorization', `Bearer ${token}`)
        .send(dummyRequest)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('message');
          res.body.should.have.property('data').be.a('object');
          done();
        });
    });

    it('it should return 409 if request already exists', (done) => {
      dummyRequest.request_type = 'OneWay';
      chai
        .request(app)
        .post('/api/v1/requests')
        .set('Authorization', `Bearer ${token}`)
        .send(dummyRequest)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.have.property('error');
          done();
        });
    });

    it('it should create a return trip request', (done) => {
      dummyRequest.reason = 'new reason';
      dummyRequest.request_type = 'ReturnTrip';
      dummyRequest.return_date = '2020-09-25';

      chai
        .request(app)
        .post('/api/v1/requests')
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
        .post('/api/v1/requests')
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
        .post('/api/v1/requests/')
        .set('Authorization', `Bearer ${token}`)
        .send(dummyRequest)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').be.a('string');
          done();
        });
    });
  });
  describe('PATCH api/v1/requests/:id', () => {
    const Request = {
      location_id: 2,
      destinations: '1',
      reason: 'Vacation',
    };
    it('it should update request', (done) => {
      chai
        .request(app)
        .patch('/api/v1/requests/2')
        .set('Authorization', `Bearer ${token2}`)
        .send(Request)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it('it should not update request when param is not a valid integer', (done) => {
      chai
        .request(app)
        .patch('/api/v1/requests/a')
        .set('Authorization', `Bearer ${token2}`)
        .send(Request)
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });
    it('it should not update request when line manager is not updated in the user profile table', (done) => {
      chai
        .request(app)
        .patch('/api/v1/requests/3')
        .set('Authorization', `Bearer ${token}`)
        .send(Request)
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });
    it('it should not update request when not found', (done) => {
      chai
        .request(app)
        .patch('/api/v1/requests/100000')
        .set('Authorization', `Bearer ${token2}`)
        .send(Request)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
    it('it should not update another users request', (done) => {
      chai
        .request(app)
        .patch('/api/v1/requests/5')
        .set('Authorization', `Bearer ${token2}`)
        .send(Request)
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });
    it('it should not update request when it is no longer pending', (done) => {
      chai
        .request(app)
        .patch('/api/v1/requests/3')
        .set('Authorization', `Bearer ${token2}`)
        .send(Request)
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });
  });
});

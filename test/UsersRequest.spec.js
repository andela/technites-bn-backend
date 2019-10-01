/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import moment from 'moment';
import app from '../src/index';
import AuthHelper from '../src/utils/AuthHelper';
import redisClient from '../src/utils/RedisConnection';
import database from '../src/database/models';

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

    it('it should return the most travelled destination', (done) => {
      chai
        .request(app)
        .get('/api/v1/requests?mostTraveledDestination=true')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').be.a('string');
          res.body.should.not.have.property('data');
          done();
        });
    });
  });
  describe('POST/GET on api/v1/users/:id/requests or api/requests/:id', () => {
    describe('POST api/v1/requests', () => {
      const dummyRequest = {
        request_type: 'OneWay',
        location_id: 1,
        departure_date: '2020-09-25',
        destinations: [{
          destination_id: 3, accomodation_id: 1, check_in: '2020-09-25', check_out: '2020-09-25'
        },
        {
          destination_id: 2, accomodation_id: 2, check_in: '2020-09-25', check_out: '2020-09-25'
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

      it('it should return the most travelled destination', async () => {
        await database.Request.update({ status: 'Approved' }, { where: { status: 'Pending' } });

        const res = await chai
          .request(app)
          .get('/api/v1/requests?mostTraveledDestination=true')
          .set('Authorization', `Bearer ${token}`);

        res.should.have.status(200);
        res.body.should.have.property('data').be.a('object');
        res.body.should.have.property('message').be.a('string');

        await database.Request.update({ status: 'Pending' }, { where: { status: 'Approved' } });
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
          .get('/api/v1/requests/1/approve')
          .set('Authorization', `Bearer ${adminToken}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('message').be.eql('Trip request Approved');
            done();
          });
      });

      it('it should reject a user request', (done) => {
        chai
          .request(app)
          .get('/api/v1/requests/1/reject')
          .set('Authorization', `Bearer ${adminToken}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('message').be.eql('Trip request rejected');
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
        destinations: [
          {
            destination_id: 1,
            accomodation_id: 1,
            check_in: moment().toDate(),
            check_out: moment().add(7, 'days').toDate()
          }
        ],
        reason: 'Vacation',
      };
      it('it should update request', (done) => {
        chai
          .request(app)
          .patch('/api/v1/requests/3')
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
          .patch('/api/v1/requests/1')
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
          .patch('/api/v1/requests/4')
          .set('Authorization', `Bearer ${token2}`)
          .send(Request)
          .end((err, res) => {
            res.should.have.status(403);
            done();
          });
      });
    });
    describe('GET Search the requests database', () => {
      const keyWord = 'reason';
      const beforeDate = 2030, afterDate = 2019, unrealisticBefore = 2090;
      const column1 = 'departure_date', column2 = 'createdAt';

      it('should search by key_word', (done) => {
        chai
          .request(app)
          .get(`/api/v1/requests/search?key_word=${keyWord}`)
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body.message).to.be.a('string');
            done();
          });
      });

      it('should search by a before date', (done) => {
        chai
          .request(app)
          .get(`/api/v1/requests/search?beforeDate=${beforeDate}`)
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            expect(res.body.status).to.equal('200');
            done();
          });
      });

      it('should search by a before date in createdAt column', (done) => {
        chai
          .request(app)
          .get(`/api/v1/requests/search?beforeDate=${beforeDate}&column=${column2}`)
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            expect(res.body.status).to.equal('200');
            done();
          });
      });

      it('should search by a before date in daparture_time column', (done) => {
        chai
          .request(app)
          .get(`/api/v1/requests/search?beforeDate=${beforeDate}&column=${column1}`)
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            expect(res.body.status).to.equal('200');
            done();
          });
      });

      it('should search by an after date', (done) => {
        chai
          .request(app)
          .get(`/api/v1/requests/search?afterDate=${afterDate}`)
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            expect(res.body.status).to.equal('200');
            done();
          });
      });

      it('should search in a range of dates', (done) => {
        chai
          .request(app)
          .get(`/api/v1/requests/search?beforeDate=${beforeDate}&afterDate=${afterDate}`)
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            expect(res.body.status).to.equal('200');
            done();
          });
      });

      it('should search in a range of dates in the departure column', (done) => {
        chai
          .request(app)
          .get(`/api/v1/requests/search?beforeDate=${beforeDate}&afterDate=${afterDate}&column=${column1}`)
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            expect(res.body.status).to.equal('200');
            done();
          });
      });

      it('should search in a range of dates in the createdAt column', (done) => {
        chai
          .request(app)
          .get(`/api/v1/requests/search?beforeDate=${beforeDate}&afterDate=${afterDate}&column=${column2}`)
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            expect(res.body.status).to.equal('200');
            done();
          });
      });

      it('should give errors when search values are invalid', (done) => {
        chai
          .request(app)
          .get('/api/v1/requests/search?')
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            expect(res.body.status).to.equal(400);
            done();
          });
      });
    });
  });
});

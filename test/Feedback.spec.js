/* eslint-disable camelcase */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/index';
import AccommodationServices from '../src/services/AccomodationServices';

chai.use(chaiHttp);

describe('Accommodation feedback', () => {
  const accommodation = {
    accommodation_name: 'testAccommodation',
    image_url: 'somedummyurl',
    location: 'other location',
    room_type: 'dummy roomtype'
  };
  let requesterToken;
  let accomodation_id;
  const user = {
    email: 'requester@request.com',
    password: process.env.SUPER_ADMIN_PASS
  };
  before(async () => {
    const testAccommodation = await AccommodationServices.createAccomodation(accommodation);
    accomodation_id = testAccommodation.dataValues.id;
  });

  it('Should first login a user', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(user)
      .end((err, res) => {
        requesterToken = res.body.data.token;
        done();
      });
  });


  it('Should create a feedback for an existing accomodation', (done) => {
    chai
      .request(app)
      .post(`/api/v1/accommodations/${accomodation_id}/feedbacks`)
      .set('Authorization', `Bearer ${requesterToken}`)
      .send({ feedback: 'this is my feedback' })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body.message).to.be.a('string');
        done();
      });
  });

  it('Should not create a feedback with an empty feedback', (done) => {
    chai
      .request(app)
      .post(`/api/v1/accommodations/${accomodation_id}/feedbacks`)
      .set('Authorization', `Bearer ${requesterToken}`)
      .send('feedback object required')
      .end((err, res) => {
        expect(res.statusCode).to.equal(422);
      });
    done();
  });

  it('Should get all feedbacks for a given accommodation', (done) => {
    chai
      .request(app)
      .get(`/api/v1/accommodations/${accomodation_id}/feedbacks`)
      .set('Authorization', `Bearer ${requesterToken}`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.message).to.be.a('string');
      });
    done();
  });
});

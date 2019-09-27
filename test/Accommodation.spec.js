import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import { uploader } from 'cloudinary';
import AuthHelper from '../src/utils/AuthHelper';
import app from '../src/index';

chai.use(chaiHttp);
chai.should();

const sandBox = sinon.createSandbox();

const { jwtSign } = AuthHelper;

const accomodationUrl = '/api/v1/accommodations';

describe('Accomodations', () => {
  // mock cloudinary response
  const cloudnaryRes = {
    public_id: 'eneivicys42bq5f2jpn2',
    url: 'https://res.cloudinary.com/mucyomiller/image/upload/v1562518550/apartment1_hemjm4.jpg'
  };
  beforeEach(() => {
    sandBox.stub(uploader, 'upload').returns(cloudnaryRes);
  });

  afterEach(() => {
    sandBox.restore();
  });

  const adminToken = jwtSign({ email: 'travel@admin.com' });
  const userToken = jwtSign({ email: 'technitesdev@gmail.com' });

  describe('POST /accommodation', () => {
    it('creates an accommodation when the user is a travel admin', (done) => {
      chai
        .request(app)
        .post(accomodationUrl)
        .set('Authorization', `Bearer ${adminToken}`)
        .attach('images', 'test/testPik.png', 'testPik.png')
        .field('accommodation_name', 'Andela suites')
        .field('room_type', '2 bed room')
        .field('location', 'Kigali')
        .field('description', 'best and spacious')
        .field('quantity', 5)
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          expect(res.body.message).to.equal('Accomodation facility succesifully created');
        });
      done();
    });

    it('should not create an accommodation facility when the user is not a travel admin', (done) => {
      chai
        .request(app)
        .post(accomodationUrl)
        .set('Authorization', `Bearer ${userToken}`)
        .attach('images', 'test/testPik.png', 'testPik.png')
        .field('accommodation_name', 'Andela suites')
        .field('room_type', '2 bed room')
        .field('location', 'Kigali')
        .field('description', 'best and spacious')
        .field('quantity', 5)
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          expect(res.body.message).to.equal('Access denied');
        });
      done();
    });

    it('should not duplicate an accommodation facility', (done) => {
      chai
        .request(app)
        .post(accomodationUrl)
        .set('Authorization', `Bearer ${adminToken}`)
        .attach('images', 'test/testPik.png', 'testPik.png')
        .field('accommodation_name', 'Andela suites')
        .field('room_type', '2 bed room')
        .field('location', 'Kigali')
        .field('description', 'best and spacious')
        .field('quantity', 5)
        .end((err, res) => {
          expect(res.statusCode).to.equal(409);
          expect(res.body.message).to.equal('Accommodation facility already exist');
        });
      done();
    });

    it('should not create an accommodation facility with missing fields', (done) => {
      chai
        .request(app)
        .post(accomodationUrl)
        .set('Authorization', `Bearer ${userToken}`)
        .attach('images', 'test/testPik.png', 'testPik.png')
        .field('accommodation_name', 'Andela suites')
        .field('room_type', '')
        .field('location', '')
        .field('description', 'best and spacious')
        .field('quantity', 5)
        .end((err, res) => {
          expect(res.statusCode).to.equal(422);
        });
      done();
    });
  });
});

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import { uploader } from 'cloudinary';
import AuthHelper from '../src/utils/AuthHelper';
import app from '../src/index';
import AccommodationService from '../src/services/AccomodationServices';
import LocationService from '../src/services/LocationServices';
import UserService from '../src/services/UserServices';
import database from '../src/database/models';

chai.use(chaiHttp);
chai.should();

const sandBox = sinon.createSandbox();

const { jwtSign } = AuthHelper;
const { createAccomodation, findAccommodationByName } = AccommodationService;
const { addLocation } = LocationService;
const { addUser } = UserService;
const accomodationUrl = '/api/v1/accommodations';
const hostToken = jwtSign({ email: 'host@gmail.com' });
const hostToken2 = jwtSign({ email: 'host2@gmail.com' });
let accId = null;
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
  const userToken = jwtSign({ email: 'requester@request.com' });
  const token2 = jwtSign({ email: 'requesterfortest@gmail.com' });
  let locationId = null;
  let accommodation = null;
  describe('POST /accommodation', () => {
    it('creates an accommodation when the user is a travel admin', (done) => {
      chai
        .request(app)
        .post(accomodationUrl)
        .set('Authorization', `Bearer ${adminToken}`)
        .field('accommodation_name', 'Andela suites')
        .field('description', 'best and spacious accommodation in the city at the moment')
        .field('location', 'Kigali')
        .attach('images', 'test/testPik.png', 'testPik.png')
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
        .field('accommodation_name', 'Andela suites')
        .field('description', 'best and spacious accommodation in the city at the moment')
        .field('location', 'Kigali')
        .attach('images', 'test/testPik.png', 'testPik.png')
        .end((err, res) => {
          expect(res.body.status).to.equal(401);
        });
      done();
    });

    it('should not duplicate an accommodation facility', (done) => {
      chai
        .request(app)
        .post(accomodationUrl)
        .set('Authorization', `Bearer ${adminToken}`)
        .field('accommodation_name', 'Andela suites')
        .field('description', 'best and spacious accommodation in the city at the moment')
        .field('location', 'Kigali')
        .attach('images', 'test/testPik.png', 'testPik.png')
        .end((err, res) => {
          expect(res.body.status).to.equal(409);
          // expect(res.body.message).to.equal('Accommodation facility already exist');
        });
      done();
    });

    it('should not create an accommodation facility with missing fields', (done) => {
      chai
        .request(app)
        .post(accomodationUrl)
        .set('Authorization', `Bearer ${userToken}`)
        .field('accommodation_name', 'Andela suites')
        .field('description', 'best and spacious accommodation in the city at the moment')
        .field('location', '')
        .attach('images', 'test/testPik.png', 'testPik.png')
        .end((err, res) => {
          expect(res.body.status).to.equal(422);
        });
      done();
    });
  });
  describe('POST /accommodation by Host', () => {
    beforeEach(async () => {
      const location = {
        name: 'MyTestLocation',
      };
      const newLocation = await addLocation(location);
      locationId = newLocation.id;
      const requestor = {
        firstname: 'requester',
        lastname: 'fortest',
        email: 'requesterfortest@gmail.com',
        is_verified: true,
        role_value: 1,
      };
      await addUser(requestor);
    });
    afterEach(async () => {
      await database.location.destroy({ where: { name: 'MyTestLocation' } });
      await database.User.destroy({ where: { email: 'requesterfortest@gmail.com' } });
    });
    it('Should not create an accommodation when location does not exist', async () => {
      const newAccommodation = await chai.request(app)
        .post('/api/v1/accommodations/hosts')
        .set('Authorization', `${hostToken}`)
        .field('accommodation_name', 'Test Accommodation')
        .field('description', 'This is a very good place to be')
        .field('location', 100)
        .field('services', '[{"service":"hello"}]')
        .field('amenities', '[{"amenity":"hello"}]')
        .attach('images', 'src/utils/assets/accommodation1.jpg', 'accommodation1.jpg')
        .attach('images', 'src/utils/assets/accommodation2.jpg', 'accommodation2.jpg')
        .attach('images', 'src/utils/assets/accommodation3.jpeg', 'accommodation3.jpeg');
      expect(newAccommodation.body.status).to.equal(404);
    });
    it('Should create an accommodation', async () => {
      const newAccommodation = await chai.request(app)
        .post('/api/v1/accommodations/hosts')
        .set('Authorization', `${hostToken}`)
        .field('accommodation_name', 'Test Accommodation')
        .field('description', 'This is a very good place to be')
        .field('location', locationId)
        .field('services', '[{"service":"hello"}]')
        .field('amenities', '[{"amenity":"hello"}]')
        .attach('images', 'src/utils/assets/accommodation1.jpg', 'accommodation1.jpg')
        .attach('images', 'src/utils/assets/accommodation2.jpg', 'accommodation2.jpg')
        .attach('images', 'src/utils/assets/accommodation3.jpeg', 'accommodation3.jpeg');
      expect(newAccommodation.body.status).to.equal(201);
    });
    it('Should not create an accommodation when user is not allowed to access it', async () => {
      const newAccommodation = await chai.request(app)
        .post('/api/v1/accommodations/hosts')
        .set('Authorization', `${token2}`)
        .field('accommodation_name', 'Test Accommodation')
        .field('description', 'This is a very good place to be')
        .field('location', locationId)
        .field('services', '[{"service":"hello"}]')
        .field('amenities', '[{"amenity":"hello"}]')
        .attach('images', 'src/utils/assets/accommodation1.jpg', 'accommodation1.jpg')
        .attach('images', 'src/utils/assets/accommodation2.jpg', 'accommodation2.jpg')
        .attach('images', 'src/utils/assets/accommodation3.jpeg', 'accommodation3.jpeg');
      expect(newAccommodation.body.status).to.equal(403);
    });
    it('Should not create an accommodation when there is an invalid image', async () => {
      const newAccommodation = await chai.request(app)
        .post('/api/v1/accommodations/hosts')
        .set('Authorization', `${hostToken}`)
        .field('accommodation_name', 'Test Accommodation 2')
        .field('description', 'This is a very good place to be 2')
        .field('location', locationId)
        .field('services', '[{"service":"hello"}]')
        .field('amenities', '[{"amenity":"hello"}]')
        .attach('images', 'src/utils/assets/accommodation1.jpg', 'accommodation1.jpg')
        .attach('images', 'src/utils/assets/accommodation2.jpg', 'accommodation2.jpg')
        .attach('images', 'src/utils/assets/Test.rtf', 'Test.rtf');
      expect(newAccommodation.body.status).to.equal(415);
    });
    it('Should return all accommodations when exist', (done) => {
      chai.request(app)
        .get('/api/v1/accommodations')
        .set('Accept', 'application/json')
        .send()
        .end((err, res) => {
          expect(res.body.status).to.equal(200);
          done();
        });
    });
    it('Should return single accommodations when exist', (done) => {
      chai.request(app)
        .get('/api/v1/accommodations/1')
        .set('Accept', 'application/json')
        .send()
        .end((err, res) => {
          expect(res.body.status).to.equal(200);
          done();
        });
    });
    it('Should return appropriate message when accommodations do not exist', (done) => {
      chai.request(app)
        .get('/api/v1/accommodations/100')
        .set('Accept', 'application/json')
        .send()
        .end((err, res) => {
          expect(res.body.status).to.equal(404);
          done();
        });
    });
    it('Should return all accommodations in a specific location', (done) => {
      chai.request(app)
        .get(`/api/v1/accommodations/location/${locationId}`)
        .set('Accept', 'application/json')
        .send()
        .end((err, res) => {
          expect(res.body.status).to.equal(200);
          done();
        });
    });
  });
  describe('POST rooms to accommodation', () => {
    beforeEach(async () => {
      const location = {
        name: 'My2TestLocation',
      };
      const newLocation = await addLocation(location);
      locationId = newLocation.id;
      const host = {
        firstname: 'host',
        lastname: 'fortest',
        email: 'host2@gmail.com',
        is_verified: true,
        role_value: 0,
      };
      const host2 = await addUser(host);
      const newAccommodation = {
        accommodation_name: 'NewAccommodation',
        description: 'greate place',
        location: locationId,
        services: '[{"service":"hello"}]',
        amenities: '[{"amenity":"hello"}]',
        images: '[{"image_url":"src/utils/assets/accommodation1.jpg"},{"image_url":"src/utils/assets/accommodation2.jpg"}]',
        owner: host2.id
      };
      await createAccomodation(newAccommodation);
      accommodation = await findAccommodationByName(newAccommodation.accommodation_name);
    });
    afterEach(async () => {
      await database.location.destroy({ where: { name: 'My2TestLocation' } });
      await database.User.destroy({ where: { email: 'host2@gmail.com' } });
      await database.Accomodations.destroy({ where: { accommodation_name: 'NewAccommodation' } });
    });
    it('Should add a room to the  accommodation', async () => {
      const newRoom = await chai.request(app)
        .post('/api/v1/accommodations/rooms')
        .set('Authorization', `${hostToken2}`)
        .field('accommodation_id', accommodation.id)
        .field('name', 'Test Room')
        .field('room_type', 'single')
        .field('description', 'This is a very good place to be')
        .field('cost', 100)
        .field('status', true)
        .attach('images', 'src/utils/assets/accommodation1.jpg', 'accommodation1.jpg')
        .attach('images', 'src/utils/assets/accommodation2.jpg', 'accommodation2.jpg')
        .attach('images', 'src/utils/assets/accommodation3.jpeg', 'accommodation3.jpeg');
      expect(newRoom.body.status).to.equal(201);
    });
    it('Should not add a room to the  accommodation when user does not own it', async () => {
      const newRoom = await chai.request(app)
        .post('/api/v1/accommodations/rooms')
        .set('Authorization', `${hostToken}`)
        .field('accommodation_id', accommodation.id)
        .field('name', 'Test Room')
        .field('room_type', 'single')
        .field('description', 'This is a very good place to be')
        .field('cost', 100)
        .field('status', true)
        .attach('images', 'src/utils/assets/accommodation1.jpg', 'accommodation1.jpg')
        .attach('images', 'src/utils/assets/accommodation2.jpg', 'accommodation2.jpg')
        .attach('images', 'src/utils/assets/accommodation3.jpeg', 'accommodation3.jpeg');
      expect(newRoom.body.status).to.equal(403);
    });
    it('Should not add a room to the  accommodation when accommodation id does not exist', async () => {
      const newRoom = await chai.request(app)
        .post('/api/v1/accommodations/rooms')
        .set('Authorization', `${hostToken2}`)
        .field('accommodation_id', 100)
        .field('name', 'Test Room')
        .field('room_type', 'single')
        .field('description', 'This is a very good place to be')
        .field('cost', 100)
        .field('status', true)
        .attach('images', 'src/utils/assets/accommodation1.jpg', 'accommodation1.jpg')
        .attach('images', 'src/utils/assets/accommodation2.jpg', 'accommodation2.jpg')
        .attach('images', 'src/utils/assets/accommodation3.jpeg', 'accommodation3.jpeg');
      expect(newRoom.body.status).to.equal(404);
    });
    it('Should not add a room to the  accommodation when image is not valid', async () => {
      const newRoom = await chai.request(app)
        .post('/api/v1/accommodations/rooms')
        .set('Authorization', `${hostToken2}`)
        .field('accommodation_id', accommodation.id)
        .field('name', 'Test Room')
        .field('room_type', 'single')
        .field('description', 'This is a very good place to be')
        .field('cost', 100)
        .field('status', true)
        .attach('images', 'src/utils/assets/accommodation1.jpg', 'accommodation1.jpg')
        .attach('images', 'src/utils/assets/accommodation2.jpg', 'accommodation2.jpg')
        .attach('images', 'src/utils/assets/Test.rtf', 'Test.rtf');
      expect(newRoom.body.status).to.equal(415);
    });
    it('Should return single room', (done) => {
      chai.request(app)
        .get(`/api/v1/accommodations/${accommodation.id}/rooms/1`)
        .set('Accept', 'application/json')
        .send()
        .end((err, res) => {
          expect(res.body.status).to.equal(200);
          done();
        });
    });
    it('Should return appropriate message when a single room is not found', (done) => {
      chai.request(app)
        .get(`/api/v1/accommodations/${accommodation.id}/rooms/100`)
        .set('Accept', 'application/json')
        .send()
        .end((err, res) => {
          expect(res.body.status).to.equal(404);
          done();
        });
    });
    it('Should return all rooms in an accommodation', (done) => {
      chai.request(app)
        .get(`/api/v1/accommodations/${accommodation.id}/rooms`)
        .set('Accept', 'application/json')
        .send()
        .end((err, res) => {
          expect(res.body.status).to.equal(200);
          done();
        });
    });
  });
  describe('POST rooms to accommodation', () => {
    before(async () => {
      const location = {
        name: 'My2TestLocation',
      };
      const newLocation = await addLocation(location);
      locationId = newLocation.id;
      const host = {
        firstname: 'host',
        lastname: 'fortest',
        email: 'host2@gmail.com',
        is_verified: true,
        role_value: 1,
      };
      const host2 = await addUser(host);
      const newAccommodation = {
        accommodation_name: 'NewAccommodation',
        description: 'greate place',
        location: locationId,
        services: '[{"service":"hello"}]',
        amenities: '[{"amenity":"hello"}]',
        images: '[{"image_url":"src/utils/assets/accommodation1.jpg"},{"image_url":"src/utils/assets/accommodation2.jpg"}]',
        owner: host2.id
      };
      await createAccomodation(newAccommodation);
      accommodation = await findAccommodationByName(newAccommodation.accommodation_name);
      accId = accommodation.id;
    });
    after(async () => {
      await database.location.destroy({ where: { name: 'My2TestLocation' } });
      await database.User.destroy({ where: { email: 'host2@gmail.com' } });
      await database.Accomodations.destroy({ where: { accommodation_name: 'NewAccommodation' } });
    });
    it('Should create new like', (done) => {
      chai.request(app)
        .post(`/api/v1/accommodations/${accId}/like`)
        .set('Authorization', `${hostToken2}`)
        .send()
        .end((err, res) => {
          expect(res.body.status).to.equal(201);
          done();
        });
    });
    it('Should dislike', (done) => {
      chai.request(app)
        .post(`/api/v1/accommodations/${accId}/like`)
        .set('Authorization', `${hostToken2}`)
        .send()
        .end((err, res) => {
          expect(res.body.status).to.equal(200);
          done();
        });
    });
    it('Should like it back', (done) => {
      chai.request(app)
        .post(`/api/v1/accommodations/${accId}/like`)
        .set('Authorization', `${hostToken2}`)
        .send()
        .end((err, res) => {
          expect(res.body.status).to.equal(200);
          done();
        });
    });
    it('Should not like when parameter is not a valid integer', (done) => {
      chai.request(app)
        .post('/api/v1/accommodations/test/like')
        .set('Authorization', `${hostToken2}`)
        .send()
        .end((err, res) => {
          expect(res.body.status).to.equal(400);
          done();
        });
    });
    it('Should not like when accommodation does not exist', (done) => {
      chai.request(app)
        .post('/api/v1/accommodations/100/like')
        .set('Authorization', `${hostToken2}`)
        .send()
        .end((err, res) => {
          expect(res.body.status).to.equal(404);
          done();
        });
    });
  });
});

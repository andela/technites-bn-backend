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
const hostToken = jwtSign({ email: 'host@gmail.com' });
const userToken = jwtSign({ email: 'technitesdev@gmail.com' });
let accId = null;
let roomId = null;
describe('Host Accomodations', () => {
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

  describe('POST /accommodation by Host', () => {
    it('Should create an accommodation', async () => {
      const newAccommodation = await chai.request(app)
        .post('/api/v1/accommodations/hosts')
        .set('Authorization', `${hostToken}`)
        .field('accommodation_name', 'Test Accommodation')
        .field('description', 'This is a very good place to be')
        .field('location', 1)
        .field('services', '[{"service":"hello"}]')
        .field('amenities', '[{"amenity":"hello"}]')
        .attach('images', 'src/utils/assets/accommodation1.jpg', 'accommodation1.jpg')
        .attach('images', 'src/utils/assets/accommodation2.jpg', 'accommodation2.jpg')
        .attach('images', 'src/utils/assets/accommodation3.jpeg', 'accommodation3.jpeg');
      accId = newAccommodation.body.data.id;
      expect(newAccommodation.body.status).to.equal(201);
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
    it('Should not create an accommodation when user is not allowed to access it', async () => {
      const newAccommodation = await chai.request(app)
        .post('/api/v1/accommodations/hosts')
        .set('Authorization', `${userToken}`)
        .field('accommodation_name', 'Test Accommodation')
        .field('description', 'This is a very good place to be')
        .field('location', 1)
        .field('services', '[{"service":"hello"}]')
        .field('amenities', '[{"amenity":"hello"}]')
        .attach('images', 'src/utils/assets/accommodation1.jpg', 'accommodation1.jpg')
        .attach('images', 'src/utils/assets/accommodation2.jpg', 'accommodation2.jpg')
        .attach('images', 'src/utils/assets/accommodation3.jpeg', 'accommodation3.jpeg');
      console.log('222*****', newAccommodation.body);

      // expect(newAccommodation.body.status).to.equal(403);
    });
    it('Should not create an accommodation when there is an invalid image', async () => {
      const newAccommodation = await chai.request(app)
        .post('/api/v1/accommodations/hosts')
        .set('Authorization', `${hostToken}`)
        .field('accommodation_name', 'Test Accommodation 2')
        .field('description', 'This is a very good place to be 2')
        .field('location', 1)
        .field('services', '[{"service":"hello"}]')
        .field('amenities', '[{"amenity":"hello"}]')
        .attach('images', 'src/utils/assets/accommodation1.jpg', 'accommodation1.jpg')
        .attach('images', 'src/utils/assets/accommodation2.jpg', 'accommodation2.jpg')
        .attach('images', 'src/utils/assets/Test.rtf', 'Test.rtf');
      console.log('333*****', newAccommodation.body);

      // expect(newAccommodation.body.status).to.equal(415);
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
        .get(`/api/v1/accommodations/${accId}`)
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
        .get(`/api/v1/accommodations/location/${accId}`)
        .set('Accept', 'application/json')
        .send()
        .end((err, res) => {
          expect(res.body.status).to.equal(200);
          done();
        });
    });
  });
  describe('POST rooms to a host accommodation', () => {
    it('Should add a room to the  accommodation', async () => {
      const newRoom = await chai.request(app)
        .post('/api/v1/accommodations/rooms')
        .set('Authorization', `${hostToken}`)
        .field('accommodation_id', accId)
        .field('name', 'Test Room')
        .field('room_type', 'single')
        .field('description', 'This is a very good place to be')
        .field('cost', 100)
        .field('status', true)
        .attach('images', 'src/utils/assets/accommodation1.jpg', 'accommodation1.jpg')
        .attach('images', 'src/utils/assets/accommodation2.jpg', 'accommodation2.jpg')
        .attach('images', 'src/utils/assets/accommodation3.jpeg', 'accommodation3.jpeg');
      roomId = newRoom.body.data.id;
      expect(newRoom.body.status).to.equal(201);
    });
    it('Should not add a room to the  accommodation when user does not own it', async () => {
      const newRoom = await chai.request(app)
        .post('/api/v1/accommodations/rooms')
        .set('Authorization', `${userToken}`)
        .field('accommodation_id', accId)
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
        .set('Authorization', `${hostToken}`)
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
        .set('Authorization', `${hostToken}`)
        .field('accommodation_id', accId)
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
        .get(`/api/v1/accommodations/${accId}/rooms/${roomId}`)
        .set('Accept', 'application/json')
        .send()
        .end((err, res) => {
          expect(res.body.status).to.equal(200);
          done();
        });
    });
    it('Should return appropriate message when a single room is not found', (done) => {
      chai.request(app)
        .get(`/api/v1/accommodations/${accId}/rooms/100`)
        .set('Accept', 'application/json')
        .send()
        .end((err, res) => {
          expect(res.body.status).to.equal(404);
          done();
        });
    });
    it('Should return all rooms in an accommodation', (done) => {
      chai.request(app)
        .get(`/api/v1/accommodations/${accId}/rooms`)
        .set('Accept', 'application/json')
        .send()
        .end((err, res) => {
          expect(res.body.status).to.equal(200);
          done();
        });
    });
  });
  describe('LIKE/UNLIKE accommodations', () => {
    it('Should create new like', (done) => {
      chai.request(app)
        .post(`/api/v1/accommodations/${accId}/like`)
        .set('Authorization', `${userToken}`)
        .send()
        .end((err, res) => {
          expect(res.body.status).to.equal(201);
          done();
        });
    });
    it('Should dislike', (done) => {
      chai.request(app)
        .post(`/api/v1/accommodations/${accId}/like`)
        .set('Authorization', `${userToken}`)
        .send()
        .end((err, res) => {
          expect(res.body.status).to.equal(200);
          done();
        });
    });
    it('Should like it back', (done) => {
      chai.request(app)
        .post(`/api/v1/accommodations/${accId}/like`)
        .set('Authorization', `${userToken}`)
        .send()
        .end((err, res) => {
          expect(res.body.status).to.equal(200);
          done();
        });
    });
    it('Should not like when parameter is not a valid integer', (done) => {
      chai.request(app)
        .post('/api/v1/accommodations/test/like')
        .set('Authorization', `${userToken}`)
        .send()
        .end((err, res) => {
          expect(res.body.status).to.equal(400);
          done();
        });
    });
    it('Should not like when accommodation does not exist', (done) => {
      chai.request(app)
        .post('/api/v1/accommodations/100/like')
        .set('Authorization', `${userToken}`)
        .send()
        .end((err, res) => {
          expect(res.body.status).to.equal(404);
          done();
        });
    });
  });
});

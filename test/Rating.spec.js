import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/index';
import AuthHelper from '../src/utils/AuthHelper';

chai.use(chaiHttp);
chai.should();

const { jwtSign } = AuthHelper;

describe('ratings endpoints', async () => {
  const token = jwtSign({ email: 'technitesdev1@gmail.com' }, '4m');
  it('should rate accommodation he/she stayed in', (done) => {
    chai
      .request(app)
      .patch('/api/v1/accommodations/4/rating')
      .set('Authorization', `Bearer ${token}`)
      .send({
        rating: 5
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.have.property('message').eql('Your rating added successful');
        done();
      });
  });

  it('should be able to rate only accommodation you stayed in', (done) => {
    chai
      .request(app)
      .patch('/api/v1/accommodations/2/rating')
      .set('Authorization', `Bearer ${token}`)
      .send({
        rating: 5
      })
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.have.property('message').eql('You can only rate accommodation you stayed in');
        done();
      });
  });

  it('should be able to retrieve rating you gave specific accommodation', (done) => {
    chai
      .request(app)
      .get('/api/v1/accommodations/4/rating')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('message').eql('Your rating on this accommodation facility');
        expect(res.body.data.accommodation_id).to.be.eql(4);
        expect(res.body.data.rating).to.be.eql(5);
        done();
      });
  });

  it('should not be able to retrieve rating for accommodation you didn\'t stayed in', (done) => {
    chai
      .request(app)
      .get('/api/v1/accommodations/2/rating')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('message').eql('We didn\'t find your rating for his facility');
        done();
      });
  });

  it('should retrieve  avarage rating for accommodation', (done) => {
    chai
      .request(app)
      .get('/api/v1/accommodations/4/ratings')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('message').eql('Users ratings for this facility');
        expect(res.body.average).to.be.eql(5);
        expect(res.body.total_ratings).to.be.eql(1);
        expect(res.body.data).to.be.a('array');
        done();
      });
  });

  it('should rate is required when rating an accommodation facility', (done) => {
    chai
      .request(app)
      .patch('/api/v1/accommodations/2/rating')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('errors').be.a('array');
        done();
      });
  });

  it('should return internal server error if accommodation doesnt exists', (done) => {
    chai
      .request(app)
      .patch('/api/v1/accommodations/400/rating')
      .set('Authorization', `Bearer ${token}`)
      .send({ rating: 4 })
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.have.property('message')
          .eql('Oops something unexcepted happened trying to adds your rating');
        done();
      });
  });
});

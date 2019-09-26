// eslint-disable-next-line no-unused-vars
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/index';

chai.use(chaiHttp);
chai.should();

describe('common endpoints', () => {
  it('should catch 404 routes', (done) => {
    chai
      .request(app)
      .get('/api/v1/catchme/IfYouCan')
      .end((err, res) => {
        res.should.have.status(404);
        expect(res.body.errors.message).to.be.eql('Not Found');
        expect(res.body.errors.error.status).to.be.eql(404);
        done();
      });
  });
});

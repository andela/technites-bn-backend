import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/index';
import AuthHelper from '../src/utils/AuthHelper';

chai.use(chaiHttp);
chai.should();

const { jwtSign } = AuthHelper;
const token = jwtSign({ email: 'technitesdev@gmail.com' }, '4m');

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
  });
});
